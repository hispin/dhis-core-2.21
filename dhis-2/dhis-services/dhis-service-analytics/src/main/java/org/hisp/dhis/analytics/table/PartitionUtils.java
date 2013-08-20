package org.hisp.dhis.analytics.table;

/*
 * Copyright (c) 2004-2012, University of Oslo
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
import java.util.Date;
import java.util.List;

import org.hisp.dhis.common.ListMap;
import org.hisp.dhis.common.NameableObject;
import org.hisp.dhis.period.Period;
import org.hisp.dhis.period.PeriodType;
import org.hisp.dhis.period.YearlyPeriodType;

/**
 * @author Lars Helge Overland
 */
public class PartitionUtils
{
    private static final YearlyPeriodType PERIODTYPE = new YearlyPeriodType();
    
    private static final String SEP = "_";

    public static List<Period> getPeriods( Date earliest, Date latest )
    {
        List<Period> periods = new ArrayList<Period>();
        
        Period period = PERIODTYPE.createPeriod( earliest );
        
        while ( period != null && period.getStartDate().before( latest ) )
        {
            periods.add( period );            
            period = PERIODTYPE.getNextPeriod( period );
        }
        
        return periods;
    }
    
    public static String getTableName( Period period, String tableName )
    {
        Period year = PERIODTYPE.createPeriod( period.getStartDate() );
        
        return tableName + SEP + year.getIsoDate();
    }

    public static Period getPeriod( String tableName )
    {
        if ( tableName == null || tableName.indexOf( SEP ) == -1 )
        {
            return null;
        }
        
        String[] split = tableName.split( SEP );
        String isoPeriod = split[split.length - 1];
        
        return PeriodType.getPeriodFromIsoString( isoPeriod );
    }
    
    public static ListMap<String, NameableObject> getTableNamePeriodMap( List<NameableObject> periods, String tableName )
    {
        ListMap<String, NameableObject> map = new ListMap<String, NameableObject>();
        
        for ( NameableObject period : periods )
        {
            map.putValue( getTableName( (Period) period, tableName ), period );
        }
        
        return map;
    }
}
