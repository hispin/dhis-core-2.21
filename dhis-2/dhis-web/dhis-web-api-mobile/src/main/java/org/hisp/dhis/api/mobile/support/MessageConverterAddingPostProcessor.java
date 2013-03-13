package org.hisp.dhis.api.mobile.support;

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
import java.util.Arrays;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.annotation.AnnotationMethodHandlerAdapter;

@Component
public class MessageConverterAddingPostProcessor
    implements BeanPostProcessor
{

    private final static Log logger = LogFactory.getLog( MessageConverterAddingPostProcessor.class );

    private HttpMessageConverter<?> messageConverter = new DataStreamSerializableMessageConverter();

    public Object postProcessBeforeInitialization( Object bean, String beanName )
        throws BeansException
    {
        return bean;
    }

    public Object postProcessAfterInitialization( Object bean, String beanName )
        throws BeansException
    {

        if ( !(bean instanceof AnnotationMethodHandlerAdapter) )
        {
            return bean;
        }

        AnnotationMethodHandlerAdapter handlerAdapter = (AnnotationMethodHandlerAdapter) bean;

        HttpMessageConverter<?>[] converterArray = handlerAdapter.getMessageConverters();
        
        List<HttpMessageConverter<?>> converters = new ArrayList<HttpMessageConverter<?>>(
            Arrays.asList( converterArray ) );

        converters.add( 0, messageConverter );

        converterArray = converters.toArray( new HttpMessageConverter<?>[converters.size()] );

        handlerAdapter.setMessageConverters( converterArray );

        log( converterArray );
        
        return handlerAdapter;
    }

    private void log( HttpMessageConverter<?>[] array )
    {
        StringBuilder sb = new StringBuilder("Converters after adding custom one: ");

        for ( HttpMessageConverter<?> httpMessageConverter : array )
        {
            sb.append( httpMessageConverter.getClass().getName() ).append( ", " );
        }
        
        String string = sb.toString();
        logger.info( string.substring( 0, string.length() - 2 ) );
    }

}
