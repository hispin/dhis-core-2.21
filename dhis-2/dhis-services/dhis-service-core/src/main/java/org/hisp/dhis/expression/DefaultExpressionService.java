package org.hisp.dhis.expression;

/*
 * Copyright (c) 2004-2007, University of Oslo
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * * Neither the name of the HISP project nor the names of its contributors may
 *   be used to endorse or promote products derived from this software without
 *   specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import static org.hisp.dhis.expression.Expression.SEPARATOR;
import static org.hisp.dhis.system.util.MathUtils.calculateExpression;

import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.dhis.common.GenericStore;
import org.hisp.dhis.dataelement.CalculatedDataElement;
import org.hisp.dhis.dataelement.DataElement;
import org.hisp.dhis.dataelement.DataElementCategoryOptionCombo;
import org.hisp.dhis.dataelement.DataElementCategoryOptionComboService;
import org.hisp.dhis.dataelement.DataElementService;
import org.hisp.dhis.dataelement.Operand;
import org.hisp.dhis.datavalue.DataValue;
import org.hisp.dhis.datavalue.DataValueService;
import org.hisp.dhis.period.Period;
import org.hisp.dhis.source.Source;
import org.hisp.dhis.system.util.MathUtils;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Margrethe Store
 * @author Lars Helge Overland
 * @version $Id: DefaultExpressionService.java 6463 2008-11-24 12:05:46Z larshelg $
 */
@Transactional
public class DefaultExpressionService
    implements ExpressionService
{
    private static final Log log = LogFactory.getLog( DefaultExpressionService.class );
    
    private static final String NULL_REPLACEMENT = "0";

    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    private GenericStore<Expression> expressionStore;

    public void setExpressionStore( GenericStore<Expression> expressionStore )
    {
        this.expressionStore = expressionStore;
    }

    private DataElementService dataElementService;

    public void setDataElementService( DataElementService dataElementService )
    {
        this.dataElementService = dataElementService;
    }

    private DataValueService dataValueService;

    public void setDataValueService( DataValueService dataValueService )
    {
        this.dataValueService = dataValueService;
    }

    private DataElementCategoryOptionComboService categoryOptionComboService;

    public void setCategoryOptionComboService( DataElementCategoryOptionComboService dataElementCategoryOptionComboService )
    {
        this.categoryOptionComboService = dataElementCategoryOptionComboService;
    }

    // -------------------------------------------------------------------------
    // Expression CRUD operations
    // -------------------------------------------------------------------------

    public int addExpression( Expression expression )
    {
        return expressionStore.save( expression );
    }

    public void deleteExpression( Expression expression )
    {
        expressionStore.delete( expression );
    }

    public Expression getExpression( int id )
    {
        return expressionStore.get( id );
    }

    public void updateExpression( Expression expression )
    {
        expressionStore.update( expression );
    }

    public Collection<Expression> getAllExpressions()
    {
        return expressionStore.getAll();
    }

    // -------------------------------------------------------------------------
    // Business logic
    // -------------------------------------------------------------------------

    public Double getExpressionValue( Expression expression, Period period, Source source )
    {
        final String expressionString = generateExpression( expression.getExpression(), period, source );

        return expressionString != null ? calculateExpression( expressionString ) : null;
    }
    
    public Set<DataElement> getDataElementsInCalculatedDataElement( int id )
    {
        final DataElement dataElement = dataElementService.getDataElement( id );
        
        if ( dataElement != null && dataElement instanceof CalculatedDataElement )
        {
            return getDataElementsInExpression( ((CalculatedDataElement) dataElement).getExpression().getExpression() );
        }
        
        return null;
    }

    public Set<DataElement> getDataElementsInExpression( String expression )
    {
        Set<DataElement> dataElementsInExpression = null;

        if ( expression != null )
        {
            dataElementsInExpression = new HashSet<DataElement>();

            final Matcher matcher = getMatcher( "(\\[\\d+\\" + SEPARATOR + "\\d+\\])", expression );

            while ( matcher.find() )
            {
                String replaceString = matcher.group();

                replaceString = replaceString.replaceAll( "[\\[\\]]", "" );
                replaceString = replaceString.substring( 0, replaceString.indexOf( SEPARATOR ) );

                final DataElement dataElement = dataElementService.getDataElement( Integer.parseInt( replaceString ) );

                if ( dataElement != null )
                {
                    dataElementsInExpression.add( dataElement );
                }
            }
        }

        return dataElementsInExpression;
    }
    
    public String convertExpression( String expression, Map<Object, Integer> dataElementMapping, Map<Object, Integer> categoryOptionComboMapping )
    {
        StringBuffer convertedFormula = new StringBuffer();
        
        if ( expression != null )
        {
            final Matcher matcher = getMatcher( "(\\[\\d+\\" + SEPARATOR + "\\d+\\])", expression );

            while ( matcher.find() )
            {
                String match = matcher.group();

                match = match.replaceAll( "[\\[\\]]", "" );

                final int dataElementId = Integer.parseInt( match.substring( 0, match.indexOf( SEPARATOR ) ) );
                final int categoryOptionComboId = Integer.parseInt( match.substring( match.indexOf( SEPARATOR ) + 1, match.length() ) );
                
                final Integer mappedDataElementId = dataElementMapping.get( dataElementId );
                final Integer mappedCategoryOptionComboId = categoryOptionComboMapping.get( categoryOptionComboId );
                
                if ( mappedDataElementId == null )
                {
                    log.info( "Data element identifier refers to non-existing object: " + dataElementId );
                    
                    match = NULL_REPLACEMENT;
                }
                else if ( mappedCategoryOptionComboId == null )
                {
                    log.info( "Category option combo identifer refers to non-existing object: " + categoryOptionComboId );
                    
                    match = NULL_REPLACEMENT;
                }
                else
                {
                    match = "[" + mappedDataElementId + SEPARATOR + mappedCategoryOptionComboId + "]";
                }
                
                matcher.appendReplacement( convertedFormula, match );
            }

            matcher.appendTail( convertedFormula );
        }
        
        return convertedFormula.toString();
    }

    public Set<Operand> getOperandsInExpression( String expression )
    {
        Set<Operand> operandsInExpression = null;

        if ( expression != null )
        {
            operandsInExpression = new HashSet<Operand>();

            final Matcher matcher = getMatcher( "(\\[\\d+\\" + SEPARATOR + "\\d+\\])", expression );

            while ( matcher.find() )
            {
                final Operand operand = new Operand();
                
                final String match = matcher.group().replaceAll( "[\\[\\]]", "" );

                operand.setDataElementId( Integer.parseInt( match.substring( 0, match.indexOf( SEPARATOR ) ) ) );
                operand.setOptionComboId( Integer.parseInt( match.substring( match.indexOf( SEPARATOR ) + 1, match.length() ) ) );
                
                operandsInExpression.add( operand );
            }
        }

        return operandsInExpression;
    }
    
    public int expressionIsValid( String formula )
    {
        StringBuffer buffer = new StringBuffer();
        
        final Matcher matcher = getMatcher( "\\[.+?\\" + SEPARATOR + ".+?\\]", formula );

        int dataElementId = -1;
        int categoryOptionComboId = -1;

        while ( matcher.find() )
        {
            String match = matcher.group();

            match = match.replaceAll( "[\\[\\]]", "" );

            final String dataElementIdString = match.substring( 0, match.indexOf( SEPARATOR ) );
            final String categoryOptionComboIdString = match.substring( match.indexOf( SEPARATOR ) + 1, match.length() );

            try
            {
                dataElementId = Integer.parseInt( dataElementIdString );
            }
            catch ( NumberFormatException ex )
            {
                return DATAELEMENT_ID_NOT_NUMERIC;
            }

            try
            {
                categoryOptionComboId = Integer.parseInt( categoryOptionComboIdString );
            }
            catch ( NumberFormatException ex )
            {
                return CATEGORYOPTIONCOMBO_ID_NOT_NUMERIC;
            }

            if ( dataElementService.getDataElement( dataElementId ) == null )
            {
                return DATAELEMENT_DOES_NOT_EXIST;
            }

            if ( categoryOptionComboService.getDataElementCategoryOptionCombo( categoryOptionComboId ) == null )
            {
                return CATEGORYOPTIONCOMBO_DOES_NOT_EXIST;
            }

            // -----------------------------------------------------------------
            // Replacing the operand with 1 in order to later be able to verify
            // that the formula is mathematically valid
            // -----------------------------------------------------------------

            matcher.appendReplacement( buffer, "1" );
        }
        
        matcher.appendTail( buffer );
        
        if ( MathUtils.expressionHasErrors( buffer.toString() ) )
        {
            return EXPRESSION_NOT_WELL_FORMED;
        }        

        return VALID;
    }

    public String getExpressionDescription( String formula )
    {
        StringBuffer buffer = null;

        if ( formula != null )
        {
            buffer = new StringBuffer();

            final Matcher matcher = getMatcher( "\\[.+?\\" + SEPARATOR + ".+?\\]", formula );

            int dataElementId = -1;
            int categoryOptionComboId = -1;

            DataElement dataElement = null;
            DataElementCategoryOptionCombo categoryOptionCombo = null;

            while ( matcher.find() )
            {
                String replaceString = matcher.group();

                replaceString = replaceString.replaceAll( "[\\[\\]]", "" );

                final String dataElementIdString = replaceString.substring( 0, replaceString.indexOf( SEPARATOR ) );
                final String optionComboIdString = replaceString.substring( replaceString.indexOf( SEPARATOR ) + 1, replaceString.length() );

                try
                {
                    dataElementId = Integer.parseInt( dataElementIdString );
                }
                catch ( NumberFormatException ex )
                {
                    throw new IllegalArgumentException( "Data element identifier must be a number: " + replaceString );
                }

                try
                {
                    categoryOptionComboId = Integer.parseInt( optionComboIdString );
                }
                catch ( NumberFormatException ex )
                {
                    throw new IllegalArgumentException( "Category option combo identifier must be a number: "
                        + replaceString );
                }

                dataElement = dataElementService.getDataElement( dataElementId );
                categoryOptionCombo = categoryOptionComboService.getDataElementCategoryOptionCombo( categoryOptionComboId );

                if ( dataElement == null )
                {
                    throw new IllegalArgumentException( "Identifier does not reference a data element: "
                        + dataElementId );
                }

                if ( categoryOptionCombo == null )
                {
                    throw new IllegalArgumentException( "Identifier does not reference a category option combo: "
                        + categoryOptionComboId );
                }

                replaceString = dataElement.getName() + SEPARATOR + categoryOptionComboService.getOptionNames( categoryOptionCombo );

                if ( replaceString.endsWith( SEPARATOR ) )
                {
                    replaceString = replaceString.substring( 0, replaceString.length() - 1 );
                }

                matcher.appendReplacement( buffer, replaceString );
            }

            matcher.appendTail( buffer );
        }

        return buffer != null ? buffer.toString() : null;
    }

    public String replaceCDEsWithTheirExpression( String expression )
    {
        StringBuffer buffer = null;

        if ( expression != null )
        {
            buffer = new StringBuffer();

            final Set<DataElement> caclulatedDataElementsInExpression = getDataElementsInExpression( expression );

            final Iterator<DataElement> iterator = caclulatedDataElementsInExpression.iterator();

            while ( iterator.hasNext() )
            {
                if ( !(iterator.next() instanceof CalculatedDataElement) )
                {
                    iterator.remove();
                }
            }

            final Matcher matcher = getMatcher( "(\\[\\d+\\" + SEPARATOR + "\\d+\\])", expression );

            while ( matcher.find() )
            {
                String replaceString = matcher.group();

                for ( DataElement dataElement : caclulatedDataElementsInExpression )
                {
                    if ( replaceString.startsWith( "[" + dataElement.getId() + SEPARATOR ) )
                    {
                        replaceString = ((CalculatedDataElement) dataElement).getExpression().getExpression();

                        break;
                    }
                }

                matcher.appendReplacement( buffer, replaceString );
            }

            matcher.appendTail( buffer );
        }

        return buffer != null ? buffer.toString() : null;
    }

    public String generateExpression( String expression, Period period, Source source )
    {
        StringBuffer buffer = null;

        if ( expression != null )
        {
            final Matcher matcher = getMatcher( "(\\[\\d+\\" + SEPARATOR + "\\d+\\])", expression );

            buffer = new StringBuffer();

            while ( matcher.find() )
            {
                String replaceString = matcher.group();

                replaceString = replaceString.replaceAll( "[\\[\\]]", "" );

                final String dataElementIdString = replaceString.substring( 0, replaceString.indexOf( SEPARATOR ) );
                final String categoryOptionComboIdString = replaceString.substring( replaceString.indexOf( SEPARATOR ) + 1, replaceString.length() );

                final int dataElementId = Integer.parseInt( dataElementIdString );
                final int optionComboId = Integer.parseInt( categoryOptionComboIdString );

                final DataElement dataElement = dataElementService.getDataElement( dataElementId );
                final DataElementCategoryOptionCombo categoryOptionCombo = categoryOptionComboService.getDataElementCategoryOptionCombo( optionComboId );

                final DataValue dataValue = dataValueService.getDataValue( source, dataElement, period, categoryOptionCombo );

                if ( dataValue == null )
                {
                    replaceString = NULL_REPLACEMENT;
                }
                else
                {
                    replaceString = String.valueOf( dataValue.getValue() );
                }

                matcher.appendReplacement( buffer, replaceString );
            }

            matcher.appendTail( buffer );
        }

        return buffer != null ? buffer.toString() : null;
    }
    
    // -------------------------------------------------------------------------
    // Supportive methods
    // -------------------------------------------------------------------------

    private Matcher getMatcher( String regex, String expression )
    {
        final Pattern pattern = Pattern.compile( regex );

        return pattern.matcher( expression );
    }
}
