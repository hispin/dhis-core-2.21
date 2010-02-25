<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="section">
  <li><a href="javascript:getHelpContent('{@id}')"><xsl:value-of select="title"/></a></li>
</xsl:template>

<xsl:template match="/">
<ul>
  <xsl:apply-templates select="book/chapter//section[@id]"/>
</ul>
</xsl:template>

</xsl:stylesheet>
