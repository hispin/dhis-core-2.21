/*
 * Copyright (c) 2004-2009, University of Oslo
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
package org.hisp.dhis.patient;

import static org.hisp.dhis.i18n.I18nUtils.i18n;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.hisp.dhis.i18n.I18nService;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Chau Thu Tran
 * @version $Id$
 */
@Transactional
public class DefaultPatientAttributeGroupService
    implements PatientAttributeGroupService
{
    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    private PatientAttributeGroupStore patientAttributeGroupStore;

    public void setPatientAttributeGroupStore( PatientAttributeGroupStore patientAttributeGroupStore )
    {
        this.patientAttributeGroupStore = patientAttributeGroupStore;
    }

    private I18nService i18nService;

    public void setI18nService( I18nService service )
    {
        i18nService = service;
    }

    // -------------------------------------------------------------------------
    // Implementation methods
    // -------------------------------------------------------------------------

    public int savePatientAttributeGroup( PatientAttributeGroup patientAttributeGroup )
    {
        return patientAttributeGroupStore.save( patientAttributeGroup );
    }

    public void deletePatientAttributeGroup( PatientAttributeGroup patientAttributeGroup )
    {
        patientAttributeGroupStore.delete( patientAttributeGroup );
    }

    public void updatePatientAttributeGroup( PatientAttributeGroup patientAttributeGroup )
    {
        patientAttributeGroupStore.update( patientAttributeGroup );
    }

    public PatientAttributeGroup getPatientAttributeGroup( int id )
    {
        return i18n( i18nService, patientAttributeGroupStore.get( id ) );
    }

    public PatientAttributeGroup getPatientAttributeGroupByName( String name )
    {
        return i18n( i18nService, patientAttributeGroupStore.getByName( name ) );
    }

    public Collection<PatientAttributeGroup> getAllPatientAttributeGroups()
    {
        return i18n( i18nService, patientAttributeGroupStore.getAll() );
    }

    public List<PatientAttribute> getPatientAttributes( PatientAttributeGroup patientAttributeGroup )
    {
        return new ArrayList<PatientAttribute>( i18n( i18nService, patientAttributeGroup.getAttributes() ) );
    }

}
