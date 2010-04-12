package org.hisp.dhis.dashboard;

/*
 * Copyright (c) 2004-2010, University of Oslo
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

import static junit.framework.Assert.assertEquals;
import static junit.framework.Assert.assertNotNull;
import static junit.framework.Assert.assertNull;
import static org.hisp.dhis.report.Report.TYPE_BIRT;

import org.hibernate.NonUniqueObjectException;
import org.hisp.dhis.DhisSpringTest;
import org.hisp.dhis.olap.OlapURL;
import org.hisp.dhis.olap.OlapURLService;
import org.hisp.dhis.report.Report;
import org.hisp.dhis.report.ReportService;
import org.hisp.dhis.user.User;
import org.hisp.dhis.user.UserStore;
import org.junit.Test;
import org.springframework.test.annotation.ExpectedException;

/**
 * @author Lars Helge Overland
 * @version $Id$
 */
public class DashboardStoreTest
    extends DhisSpringTest
{
    private UserStore userStore;
    
    private ReportService reportService;
    
    private OlapURLService olapURLService;
    
    private DashboardContentStore dashboardContentStore;
    
    private User userA;
    
    private Report reportA;
    
    private OlapURL urlA;
    
    private DashboardContent contentA;
    private DashboardContent contentB;
    
    @Override
    public void setUpTest()
    {
        userStore = (UserStore) getBean( UserStore.ID );
        
        reportService = (ReportService) getBean( ReportService.ID );

        olapURLService = (OlapURLService) getBean( OlapURLService.ID );
        
        dashboardContentStore = (DashboardContentStore) getBean( DashboardContentStore.ID );
        
        userA = createUser( 'A' );
        userStore.addUser( userA );
        
        reportA = new Report( "ReportA", "DesignA", TYPE_BIRT, null );
        reportService.saveReport( reportA );
        
        urlA = createOlapURL( 'A' );
        olapURLService.saveOlapURL( urlA );
        
        contentA = new DashboardContent();
        contentB = new DashboardContent();
    }
    
    @Test
    public void saveGet()
    {
        contentA.setUser( userA );
        contentA.getReports().add( reportA );
        contentA.getOlapUrls().add( urlA );
        
        dashboardContentStore.save( contentA );
        
        assertEquals( contentA, dashboardContentStore.get( userA ) );
        assertEquals( userA, dashboardContentStore.get( userA ).getUser() );
        assertEquals( reportA, dashboardContentStore.get( userA ).getReports().iterator().next() );
        assertEquals( urlA, dashboardContentStore.get( userA ).getOlapUrls().iterator().next() );
    }
    
    @Test
    @ExpectedException( NonUniqueObjectException.class )
    public void duplicate()
    {
        contentA.setUser( userA );
        contentB.setUser( userA );
        
        dashboardContentStore.save( contentA );
        dashboardContentStore.save( contentB );        
    }
    
    @Test
    public void saveOrUpdate()
    {
        contentA.setUser( userA );
        contentA.getReports().add( reportA );

        dashboardContentStore.save( contentA );
        
        assertEquals( contentA, dashboardContentStore.get( userA ) );
        assertEquals( reportA, dashboardContentStore.get( userA ).getReports().iterator().next() );
        
        contentA.getOlapUrls().add( urlA );

        dashboardContentStore.save( contentA );

        assertEquals( contentA, dashboardContentStore.get( userA ) );
        assertEquals( urlA, dashboardContentStore.get( userA ).getOlapUrls().iterator().next() );
    }
    
    @Test
    public void delete()
    {
        contentA.setUser( userA );
        contentA.getReports().add( reportA );
        
        dashboardContentStore.save( contentA );
        
        assertNotNull( dashboardContentStore.get( userA ) );
        
        dashboardContentStore.delete( contentA );
        
        assertNull( dashboardContentStore.get( userA ) );
    }
}
