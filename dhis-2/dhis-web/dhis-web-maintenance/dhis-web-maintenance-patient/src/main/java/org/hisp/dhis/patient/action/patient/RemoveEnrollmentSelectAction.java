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
package org.hisp.dhis.patient.action.patient;

import java.util.ArrayList;
import java.util.Collection;

import org.hisp.dhis.patient.Patient;
import org.hisp.dhis.patient.PatientService;
import org.hisp.dhis.program.Program;
import org.hisp.dhis.program.ProgramAttribute;
import org.hisp.dhis.program.ProgramAttributeService;
import org.hisp.dhis.program.ProgramInstance;
import org.hisp.dhis.program.ProgramInstanceService;
import org.hisp.dhis.program.ProgramService;

import com.opensymphony.xwork2.Action;

/**
 * @author Chau Thu Tran
 * @version $ID : RemoveEnrollmentSelectAction.java Jan 11, 2011 10:00:55 AM $
 */
public class RemoveEnrollmentSelectAction
    implements Action
{
    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    private ProgramAttributeService programAttributeService;

    private ProgramInstanceService programInstanceService;

    private ProgramService programService;

    private PatientService patientService;

    // -------------------------------------------------------------------------
    // Input/Output
    // -------------------------------------------------------------------------

    private Integer patientId;

    private Integer programInstanceId;

    private Collection<ProgramInstance> programInstances;

    private Collection<ProgramAttribute> programAttributes;

    private ProgramInstance programInstance;

    private Patient patient;

    // -------------------------------------------------------------------------
    // Setter && Getter
    // -------------------------------------------------------------------------

    public void setProgramAttributeService( ProgramAttributeService programAttributeService )
    {
        this.programAttributeService = programAttributeService;
    }

    public ProgramInstance getProgramInstance()
    {
        return programInstance;
    }

    public void setPatientService( PatientService patientService )
    {
        this.patientService = patientService;
    }

    public void setProgramService( ProgramService programService )
    {
        this.programService = programService;
    }

    public Patient getPatient()
    {
        return patient;
    }

    public void setPatientId( Integer patientId )
    {
        this.patientId = patientId;
    }

    public void setProgramInstanceId( Integer programInstanceId )
    {
        this.programInstanceId = programInstanceId;
    }

    public Collection<ProgramInstance> getProgramInstances()
    {
        return programInstances;
    }

    public Collection<ProgramAttribute> getProgramAttributes()
    {
        return programAttributes;
    }

    public void setProgramInstanceService( ProgramInstanceService programInstanceService )
    {
        this.programInstanceService = programInstanceService;
    }

    // -------------------------------------------------------------------------
    // Action implementation
    // -------------------------------------------------------------------------

    @Override
    public String execute()
        throws Exception
    {
        programAttributes = programAttributeService.getAllProgramAttributes();

        // ---------------------------------------------------------------------
        // Get programInstance
        // ---------------------------------------------------------------------

        programInstances = new ArrayList<ProgramInstance>();

        patient = patientService.getPatient( patientId );

        Collection<Program> programs = programService.getAllPrograms();

        for ( Program program : programs )
        {
            Collection<ProgramInstance> instances = programInstanceService
                .getProgramInstances( patient, program, false );

            if ( instances.iterator().hasNext() )
            {
                programInstances.add( instances.iterator().next() );
            }

        }

        // ---------------------------------------------------------------------
        // Get selected programInstance
        // ---------------------------------------------------------------------

        if ( programInstanceId != null )
        {
            programInstance = programInstanceService.getProgramInstance( programInstanceId );
        }

        return SUCCESS;
    }
}
