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

package org.hisp.dhis.attribute;

import java.util.Set;

/**
 * @author mortenoh
 */
public interface AttributeService
{
    String ID = AttributeService.class.getName();

    public void addAttribute( Attribute attribute );

    public void updateAttribute( Attribute attribute );

    public void deleteAttribute( Attribute attribute );

    public Attribute getAttribute( int id );

    public Set<Attribute> getAllAttributes();

    public void addAttributeOption( AttributeOption attributeOption );

    public void updateAttributeOption( AttributeOption attributeOption );

    public void deleteAttributeOption( AttributeOption attributeOption );

    public AttributeOption getAttributeOption( int id );

    public Set<AttributeOption> getAllAttributeOptions();

    public void addAttributeValue( AttributeValue attributeValue );

    public void updateAttributeValue( AttributeValue attributeValue );

    public void deleteAttributeValue( AttributeValue attributeValue );

    public AttributeValue getAttributeValue( int id );

    public Set<AttributeValue> getAllAttributeValues();
}
