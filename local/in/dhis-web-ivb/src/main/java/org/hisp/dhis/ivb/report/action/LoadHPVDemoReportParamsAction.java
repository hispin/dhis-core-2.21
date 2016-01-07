package org.hisp.dhis.ivb.report.action;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.hisp.dhis.dataelement.DataElementCategoryService;
import org.hisp.dhis.dataelement.DataElementService;
import org.hisp.dhis.lookup.Lookup;
import org.hisp.dhis.lookup.LookupService;
import org.hisp.dhis.organisationunit.OrganisationUnit;
import org.hisp.dhis.organisationunit.OrganisationUnitGroupService;
import org.hisp.dhis.organisationunit.OrganisationUnitService;
import org.hisp.dhis.oust.manager.SelectionTreeManager;
import org.hisp.dhis.user.CurrentUserService;
import org.springframework.beans.factory.annotation.Autowired;

import com.opensymphony.xwork2.Action;

/**
 * @author BHARATH
 */
public class LoadHPVDemoReportParamsAction implements Action
{

    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------
    @Autowired
    private LookupService lookupService;

    @Autowired
    private CurrentUserService currentUserService;

    @Autowired
    private SelectionTreeManager selectionTreeManager;
    
    @Autowired
    private OrganisationUnitService organisationUnitService;
    
    @Autowired
    private OrganisationUnitGroupService organisationUnitGroupService;
    
    @Autowired
    private DataElementService dataElementService;
    
    @Autowired
    private DataElementCategoryService deCategoryService;
    
    // -------------------------------------------------------------------------
    // Input & Output
    // -------------------------------------------------------------------------

    private Collection<OrganisationUnit> selectedUnits = new HashSet<OrganisationUnit>();

    public Collection<OrganisationUnit> getSelectedUnits()
    {
        return selectedUnits;
    }

    // -------------------------------------------------------------------------
    // Action Implementation
    // -------------------------------------------------------------------------
    
    @Override
    public String execute() throws Exception
    {
        Lookup lookup = lookupService.getLookupByName( Lookup.HPVDEMO_REPORT_PARAMS_ORGUNITGROUP );
        
        String hpvdemo_orgunitgroups = lookup.getValue();
        
        for( String strOrgunitGroupId : hpvdemo_orgunitgroups.split( ":" ) )
        {
            selectedUnits.addAll( organisationUnitGroupService.getOrganisationUnitGroup( Integer.parseInt( strOrgunitGroupId ) ).getMembers() );
        }
        
        Set<OrganisationUnit> currentUserOrgUnits = new HashSet<OrganisationUnit>( currentUserService.getCurrentUser().getDataViewOrganisationUnits() );
        selectionTreeManager.setRootOrganisationUnits( currentUserOrgUnits );

        selectionTreeManager.clearSelectedOrganisationUnits();
        selectionTreeManager.setSelectedOrganisationUnits( selectedUnits );

        /*
        System.out.println("CALLING upgrade Form");
        upgradeForm();
        System.out.println("upgrade Form method completed");
        */
        return SUCCESS;
    }
    
    
    public void upgradeForm()
    {
        String ID_EXPRESSION = "id=\"(\\d+)-(\\d+)-val\"";

        Pattern ID_PATTERN = Pattern.compile( ID_EXPRESSION );

        String upgradeHTMLCode = "";
        
        BufferedReader br = null;
		String htmlCode = "";
		StringBuffer out = new StringBuffer();

		try 
		{
			String sCurrentLine;
			br = new BufferedReader(new FileReader("C:\\Drugstatusdataset.html"));
			while ((sCurrentLine = br.readLine()) != null) 
			{
				Matcher matcher = ID_PATTERN.matcher( sCurrentLine );		        
				//System.out.println(sCurrentLine + " " + matcher.find() );
		        while( matcher.find() )
		        {
		        	System.out.println("Inside while loop ");
		            Integer deId = Integer.parseInt(matcher.group( 1 ) );
		            Integer coId = Integer.parseInt( matcher.group( 2 ) );
		        	String upgradedId = "id=\"" + dataElementService.getDataElement( deId ).getUid() + "-" + deCategoryService.getDataElementCategoryOptionCombo( coId ).getUid() + "-val\"";

		            matcher.appendReplacement( out, upgradedId );
		            System.out.println( "OUT:*************" + out );
		        }
		        matcher.appendTail( out );
				//htmlCode += sCurrentLine;
			}
			
		} 
		catch (IOException e) {
			e.printStackTrace();
		} 
		finally {
			try {
				if (br != null)br.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
		
		
		try 
		{
			File file = new File("C:\\Upgrade\\DrugstatusdatasetUp.html");

			if (!file.exists()) {
				file.createNewFile();
			}

			FileWriter fw = new FileWriter(file.getAbsoluteFile());
			BufferedWriter bw = new BufferedWriter(fw);
			bw.write( out.toString() );
			bw.close();

			System.out.println( upgradeHTMLCode );

		} 
		catch (IOException e) 
		{
			e.printStackTrace();
		}
    }
}
