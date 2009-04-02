package org.hisp.dhis.reporttable;

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
import java.util.Date;
import java.util.List;

import org.amplecode.cave.process.SerialToGroup;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.dhis.i18n.I18nFormat;
import org.hisp.dhis.organisationunit.OrganisationUnit;
import org.hisp.dhis.organisationunit.OrganisationUnitService;
import org.hisp.dhis.period.MonthlyPeriodType;
import org.hisp.dhis.report.ReportStore;
import org.hisp.dhis.reporttable.ReportTable;
import org.hisp.dhis.system.process.AbstractStatementInternalProcess;

/**
 * @author Lars Helge Overland
 * @version $Id$
 */
public abstract class ReportTableInternalProcess
    extends AbstractStatementInternalProcess implements ReportTableCreator, SerialToGroup
{
    private static final Log log = LogFactory.getLog( ReportTableInternalProcess.class );
    
    public static final String ID = "internal-process-ReportTable";
    public static final String PROCESS_TYPE = "ReportTable";

    private static final String MODE_REPORT = "report";
    private static final String MODE_REPORT_TABLE = "table";

    private static final String PROCESS_GROUP = "DataMartProcessGroup";

    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    protected ReportTableService reportTableService;

    public void setReportTableService( ReportTableService reportTableService )
    {
        this.reportTableService = reportTableService;
    }

    protected ReportStore reportStore;

    public void setReportStore( ReportStore reportStore )
    {
        this.reportStore = reportStore;
    }

    protected OrganisationUnitService organisationUnitService;

    public void setOrganisationUnitService( OrganisationUnitService organisationUnitService )
    {
        this.organisationUnitService = organisationUnitService;
    }

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private Integer id;

    public void setId( Integer id )
    {
        this.id = id;
    }

    private String mode;

    public void setMode( String mode )
    {
        this.mode = mode;
    }

    private Integer reportingPeriod;

    public void setReportingPeriod( Integer reportingPeriod )
    {
        this.reportingPeriod = reportingPeriod;
    }

    private Integer parentOrganisationUnitId;

    public void setParentOrganisationUnitId( Integer parentOrganisationUnitId )
    {
        this.parentOrganisationUnitId = parentOrganisationUnitId;
    }

    private Integer organisationUnitId;

    public void setOrganisationUnitId( Integer organisationUnitId )
    {
        this.organisationUnitId = organisationUnitId;
    }
        
    private I18nFormat format;

    public void setFormat( I18nFormat format )
    {
        this.format = format;
    }
    
    // -------------------------------------------------------------------------
    // SerialToGroup implementation
    // -------------------------------------------------------------------------

    public String getGroup()
    {
        return PROCESS_GROUP;
    }
    
    // -------------------------------------------------------------------------
    // AbstractStatementInternalProcess implementation
    // -------------------------------------------------------------------------

    public void executeStatements()
    {
        for ( ReportTable reportTable : getReportTables( id, mode ) )
        {
            // -----------------------------------------------------------------
            // Reporting period report parameter / current reporting period
            // -----------------------------------------------------------------

            Date date = null;

            if ( reportTable.getReportParams() != null && reportTable.getReportParams().isParamReportingMonth() )
            {
                reportTable.setRelativePeriods( reportTableService.getRelativePeriods( reportTable.getRelatives(), reportingPeriod ) );
                
                date = reportTableService.getDateFromPreviousMonth( reportingPeriod );
                
                log.info( "Reporting period: " + reportingPeriod );
            }
            else
            {
                reportTable.setRelativePeriods( reportTableService.getRelativePeriods( reportTable.getRelatives(), -1 ) );
                
                date = reportTableService.getDateFromPreviousMonth( -1 );
            }

            String reportingMonthName = format.formatPeriod( new MonthlyPeriodType().createPeriod( date ) );
            
            reportTable.setReportingMonthName( reportingMonthName );

            // -----------------------------------------------------------------
            // Parent organisation unit report parameter
            // -----------------------------------------------------------------

            if ( reportTable.getReportParams() != null && reportTable.getReportParams().isParamParentOrganisationUnit() )
            {
                OrganisationUnit organisationUnit = organisationUnitService.getOrganisationUnit( parentOrganisationUnitId );

                reportTable.getRelativeUnits().addAll( new ArrayList<OrganisationUnit>( organisationUnit.getChildren() ) );
                
                log.info( "Parent organisation unit: " + organisationUnit.getName() );
            }

            // -----------------------------------------------------------------
            // Organisation unit report parameter
            // -----------------------------------------------------------------

            if ( reportTable.getReportParams() != null && reportTable.getReportParams().isParamOrganisationUnit() )
            {
                OrganisationUnit organisationUnit = organisationUnitService.getOrganisationUnit( organisationUnitId );
                
                List<OrganisationUnit> organisationUnits = new ArrayList<OrganisationUnit>();
                organisationUnits.add( organisationUnit );
                reportTable.getRelativeUnits().addAll( organisationUnits );
                
                log.info( "Organisation unit: " + organisationUnit.getName() );
            }

            // -----------------------------------------------------------------
            // Set properties and initalize
            // -----------------------------------------------------------------

            reportTable.setI18nFormat( format );
            reportTable.init();

            // -----------------------------------------------------------------
            // Create report table
            // -----------------------------------------------------------------

            createReportTable( reportTable, true );
        }
                
        deleteRelativePeriods();
    }

    // -------------------------------------------------------------------------
    // Abstract methods
    // -------------------------------------------------------------------------

    protected abstract void deleteRelativePeriods();

    // -------------------------------------------------------------------------
    // Supportive methods
    // -------------------------------------------------------------------------

    /**
     * If report table mode, this method will return the report table with the
     * given identifier. If report mode, this method will return the report
     * tables associated with the report.
     * 
     * @param id the identifier.
     * @param mode the mode.
     */
    private Collection<ReportTable> getReportTables( Integer id, String mode )
    {
        Collection<ReportTable> reportTables = new ArrayList<ReportTable>();

        if ( mode.equals( MODE_REPORT_TABLE ) )
        {
            reportTables.add( reportTableService.getReportTable( id ) );
        }
        else if ( mode.equals( MODE_REPORT ) )
        {
            reportTables = reportStore.getReport( id ).getReportTables();
        }

        return reportTables;
    }
}
