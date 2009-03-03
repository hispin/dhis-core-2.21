package org.hisp.dhis.importexport.locking;

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

import java.util.ArrayList;
import java.util.Collection;

import org.apache.commons.collections.CollectionUtils;
import org.hisp.dhis.dataelement.DataElement;
import org.hisp.dhis.dataelement.DataElementService;
import org.hisp.dhis.dataset.DataSet;
import org.hisp.dhis.dataset.DataSetService;
import org.hisp.dhis.importexport.mapping.ObjectMappingGenerator;
import org.hisp.dhis.period.Period;
import org.hisp.dhis.period.PeriodService;

/**
 * @author Lars Helge Overland
 * @version $Id$
 */
public class DefaultLockingManager
    implements LockingManager
{
    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    private ObjectMappingGenerator objectMappingGenerator;

    public void setObjectMappingGenerator( ObjectMappingGenerator objectMappingGenerator )
    {
        this.objectMappingGenerator = objectMappingGenerator;
    }

    private DataSetService dataSetService;

    public void setDataSetService( DataSetService dataSetService )
    {
        this.dataSetService = dataSetService;
    }

    private DataElementService dataElementService;

    public void setDataElementService( DataElementService dataElementService )
    {
        this.dataElementService = dataElementService;
    }

    private PeriodService periodService;

    public void setPeriodService( PeriodService periodService )
    {
        this.periodService = periodService;
    }

    // -------------------------------------------------------------------------
    // LockingManager implementation
    // -------------------------------------------------------------------------

    public boolean currentImportContainsLockedData()
    {
        Collection<DataElement> dataElements = getDataElements( objectMappingGenerator.getDataElementMapping( false ).values() );
        Collection<Period> periods = getPeriods( objectMappingGenerator.getPeriodMapping( false ).values() );

        Collection<DataSet> dataSets = new ArrayList<DataSet>();
        
        for ( DataSet dataSet : dataSetService.getAllDataSets() )
        {
            if ( intersects( dataSet.getDataElements(), dataElements ) )
            {
                dataSets.add( dataSet );
            }
        }
        
        for ( DataSet dataSet : dataSets )
        {
            if ( intersects( dataSet.getLockedPeriods(), periods ) )
            {
                return true;
            }
        }
        
        return false;
    }

    // -------------------------------------------------------------------------
    // Supportive methods
    // -------------------------------------------------------------------------

    public boolean intersects( Collection<?> collection1, Collection<?> collection2 )
    {
        return CollectionUtils.intersection( collection1, collection2 ).size() > 0;
    }
    
    public Collection<DataElement> getDataElements( Collection<Integer> identifiers )
    {
        Collection<DataElement> dataElements = new ArrayList<DataElement>();
        
        for ( Integer id : identifiers )
        {
            dataElements.add( dataElementService.getDataElement( id ) );
        }
        
        return dataElements;
    }
    
    public Collection<Period> getPeriods( Collection<Integer> identifiers )
    {
        Collection<Period> periods = new ArrayList<Period>();
        
        for ( Integer id : identifiers )
        {
            periods.add( periodService.getPeriod( id ) );
        }
        
        return periods;
    }
}
