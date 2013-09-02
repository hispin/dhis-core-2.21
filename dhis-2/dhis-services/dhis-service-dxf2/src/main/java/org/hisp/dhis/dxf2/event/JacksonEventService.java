package org.hisp.dhis.dxf2.event;

/*
 * Copyright (c) 2004-2013, University of Oslo
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * Neither the name of the HISP project nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
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

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.hisp.dhis.dxf2.importsummary.ImportSummaries;
import org.hisp.dhis.dxf2.importsummary.ImportSummary;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;

/**
 * Implementation of EventService that uses Jackson for serialization and deserialization.
 *
 * @author Morten Olav Hansen <mortenoh@gmail.com>
 */
public class JacksonEventService extends BaseEventService
{
    // -------------------------------------------------------------------------
    // EventService Impl
    // -------------------------------------------------------------------------

    private static ObjectMapper xmlMapper = new XmlMapper();
    private static ObjectMapper jsonMapper = new ObjectMapper();

    @SuppressWarnings( "unchecked" )
    private static <T> T fromXml( InputStream inputStream, Class<?> clazz ) throws IOException
    {
        return (T) xmlMapper.readValue( inputStream, clazz );
    }

    @SuppressWarnings( "unchecked" )
    private static <T> T fromXml( String input, Class<?> clazz ) throws IOException
    {
        return (T) xmlMapper.readValue( input, clazz );
    }

    @SuppressWarnings( "unchecked" )
    private static <T> T fromJson( InputStream inputStream, Class<?> clazz ) throws IOException
    {
        return (T) jsonMapper.readValue( inputStream, clazz );
    }

    @SuppressWarnings( "unchecked" )
    private static <T> T fromJson( String input, Class<?> clazz ) throws IOException
    {
        return (T) jsonMapper.readValue( input, clazz );
    }

    static
    {
        xmlMapper.configure( DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, true );
        xmlMapper.configure( DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, true );
        xmlMapper.configure( DeserializationFeature.WRAP_EXCEPTIONS, true );
        jsonMapper.configure( DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, true );
        jsonMapper.configure( DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, true );
        jsonMapper.configure( DeserializationFeature.WRAP_EXCEPTIONS, true );
    }

    @Override
    public ImportSummaries saveEventsXml( InputStream inputStream ) throws IOException
    {
        ImportSummaries importSummaries = new ImportSummaries();

        String input = StreamUtils.copyToString( inputStream, Charset.forName( "UTF-8" ) );

        try
        {
            Events events = fromXml( input, Events.class );

            for ( Event event : events.getEvents() )
            {
                importSummaries.getImportSummaries().add( saveEvent( event ) );
            }
        }
        catch ( Exception ex )
        {
            Event event = fromXml( input, Event.class );
            importSummaries.getImportSummaries().add( saveEvent( event ) );
        }

        return importSummaries;
    }

    @Override
    public ImportSummary saveEventXml( InputStream inputStream ) throws IOException
    {
        Event event = fromXml( inputStream, Event.class );
        return saveEvent( event );
    }

    @Override
    public ImportSummaries saveEventsJson( InputStream inputStream ) throws IOException
    {
        ImportSummaries importSummaries = new ImportSummaries();

        String input = StreamUtils.copyToString( inputStream, Charset.forName( "UTF-8" ) );

        try
        {
            Events events = fromJson( input, Events.class );

            for ( Event event : events.getEvents() )
            {
                importSummaries.getImportSummaries().add( saveEvent( event ) );
            }
        }
        catch ( Exception ex )
        {
            Event event = fromJson( input, Event.class );
            importSummaries.getImportSummaries().add( saveEvent( event ) );
        }

        return importSummaries;
    }

    @Override
    public ImportSummary saveEventJson( InputStream inputStream ) throws IOException
    {
        Event event = fromJson( inputStream, Event.class );
        return saveEvent( event );
    }
}
