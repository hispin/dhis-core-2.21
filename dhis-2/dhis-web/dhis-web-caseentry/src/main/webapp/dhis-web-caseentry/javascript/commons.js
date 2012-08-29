
// Disable caching for ajax requests in general 

$( document ).ready( function() {
	$.ajaxSetup ({
    	cache: false
	});
} );

function dobTypeOnChange( container ){

	var type = jQuery('#' + container + ' [id=dobType]').val();
	if(type == 'V' || type == 'D')
	{
		jQuery('#' + container + ' [id=age]').rules("remove");
		jQuery('#' + container + ' [id=age]').css("display","none");
		
		jQuery('#' + container + ' [id=birthDate]').rules("add",{required:true});
		datePickerValid( container + ' [id=birthDate]' );
		jQuery('#' + container + ' [id=birthDate]').css("display","");
	}
	else if(type == 'A')
	{
		jQuery('#' + container + ' [id=age]').rules("add",{required:true, number: true});
		jQuery('#' + container + ' [id=age]').css("display","");
		
		jQuery('#' + container + ' [id=birthDate]').rules("remove","required");
		$('#' + container+ ' [id=birthDate]').datepicker("destroy");
		jQuery('#' + container + ' [id=birthDate]').css("display","none");
	}
	else 
	{
		jQuery('#' + container + ' [id=age]').rules("remove");
		jQuery('#' + container + ' [id=age]').css("display","");
		
		jQuery('#' + container + ' [id=birthDate]').rules("remove","required");
		$('#' + container+ ' [id=birthDate]').datepicker("destroy");
		jQuery('#' + container + ' [id=birthDate]').css("display","none");
	}
}

// ----------------------------------------------------------------------------
// Search patients by name
// ----------------------------------------------------------------------------

function getPatientsByName( divname )
{	
	var fullName = jQuery('#' + divname + ' [id=fullName]').val().replace(/^\s+|\s+$/g,"");
	if( fullName.length > 0) 
	{
		contentDiv = 'resultSearchDiv';
		$('#resultSearchDiv' ).load("getPatientsByName.action",
			{
				fullName: fullName
			}).dialog({
				title: i18n_search_result,
				maximize: true, 
				closable: true,
				modal:true,
				overlay:{ background:'#000000', opacity: 0.8},
				width: 800,
				height: 400
		});
	}
	else
	{
		alert( i18n_no_patients_found );
	}
}

// -----------------------------------------------------------------------------
// Advanced search
// -----------------------------------------------------------------------------

function addAttributeOption()
{
	var rowId = 'advSearchBox' + jQuery('#advancedSearchTB select[name=searchObjectId]').length + 1;
	var contend  = '<td>' + getInnerHTML('searchingAttributeIdTD') + '</td>';
		contend += '<td>' + searchTextBox ;
		contend += '&nbsp;<input type="button" class="small-button" value="-" onclick="removeAttributeOption(' + "'" + rowId + "'" + ');"></td>';
		contend = '<tr id="' + rowId + '">' + contend + '</tr>';

	jQuery('#advancedSearchTB').append( contend );
}	

function removeAttributeOption( rowId )
{
	jQuery( '#' + rowId ).remove();
}	

//------------------------------------------------------------------------------
// Search patients by selected attribute
//------------------------------------------------------------------------------

function searchObjectOnChange( this_ )
{	
	var container = jQuery(this_).parent().parent().attr('id');
	var attributeId = jQuery('#' + container + ' [id=searchObjectId]').val(); 
	var element = jQuery('#' + container + ' [id=searchText]');
	var valueType = jQuery('#' + container+ ' [id=searchObjectId] option:selected').attr('valueType');
	
	jQuery('#searchText_' + container).removeAttr('readonly', false);
	jQuery('#searchText_' + container).val("");
	if( attributeId == 'fixedAttr_birthDate' )
	{
		element.replaceWith( getDateField( container ) );
		datePickerValid( 'searchText_' + container );
		return;
	}
	
	$( '#searchText_' + container ).datepicker("destroy");
	$('#' + container + ' [id=dateOperator]').replaceWith("");
	if( attributeId == 'prg' )
	{
		element.replaceWith( programComboBox );
	}
	else if ( attributeId=='fixedAttr_gender' )
	{
		element.replaceWith( getGenderSelector() );
	}
	else if ( attributeId=='fixedAttr_age' )
	{
		element.replaceWith( getAgeTextBox() );
	}
	else if ( valueType=='YES/NO' )
	{
		element.replaceWith( getTrueFalseBox() );
	}
	else
	{
		element.replaceWith( searchTextBox );
	}
}

function getTrueFalseBox()
{
	var trueFalseBox  = '<select id="searchText" name="searchText">';
	trueFalseBox += '<option value="true">' + i18n_yes + '</option>';
	trueFalseBox += '<option value="false">' + i18n_no + '</option>';
	trueFalseBox += '</select>';
	return trueFalseBox;
}
	
function getGenderSelector()
{
	var genderSelector = '<select id="searchText" name="searchText">';
		genderSelector += '<option value="M">' + i18n_male + '</option>';
		genderSelector += '<option value="F">' + i18n_female + '</option>';
		genderSelector += '<option value="T">' + i18n_transgender + '</option>';
		genderSelector += '</select>';
	return genderSelector;
}

function getAgeTextBox( container )
{
	var ageField = '<select id="dateOperator" style="width:40px;" name="dateOperator" ><option value="="> = </option><option value="<"> < </option><option value="<="> <= </option><option value=">"> > </option><option value=">="> >= </option></select>';
	ageField += '<input type="text" id="searchText_' + container + '" name="searchText" style="width:200px;">';
	return ageField;
}

function getDateField( container )
{
	var dateField = '<select id="dateOperator" name="dateOperator" style="width:30px"><option value=">"> > </option><option value=">="> >= </option><option value="="> = </option><option value="<"> < </option><option value="<="> <= </option></select>';
	dateField += '<input type="text" id="searchText_' + container + '" name="searchText" maxlength="30" style="width:18em" onkeyup="searchPatientsOnKeyUp( event );">';
	return dateField;
}

//-----------------------------------------------------------------------------
// Search Patient
//-----------------------------------------------------------------------------

function searchPatientsOnKeyUp( event )
{
	var key = getKeyCode( event );
	
	if ( key==13 )// Enter
	{
		validateAdvancedSearch();
	}
}

function getKeyCode(e)
{
	 if (window.event)
		return window.event.keyCode;
	 return (e)? e.which : null;
}

function validateAdvancedSearch()
{
	hideById( 'listPatientDiv' );
	var flag = true;
	var dateOperator = '';
	
	if (getFieldValue('searchByProgramStage') == "true" 
		&& getFieldValue('programStageAddPatient') == '' 
		&& jQuery("#searchDiv :input[name=searchText]").val() == ''){
		flag = false;
	}
	
	jQuery("#searchDiv :input").each( function( i, item )
	{
		var elementName = $(this).attr('name');
		if( elementName=='searchText' && jQuery( item ).val() == '' && !flag)
		{
			showWarningMessage( i18n_specify_search_criteria );
			flag = false;
		}
	});
	
	if(flag){
		contentDiv = 'listPatientDiv';
		jQuery( "#loaderDiv" ).show();
		advancedSearch( getSearchParams() );
	}
}

function getSearchParams()
{
	var params = "";
	var programStageId = jQuery('#programStageAddPatient').val();
	if( getFieldValue('searchByProgramStage') == "true" && programStageId!=''){
		var statusEvent = jQuery('#programStageAddPatientTR [id=statusEvent]').val();
		var startDueDate = getFieldValue('startDueDate');
		var endDueDate = getFieldValue('endDueDate');
		params += '&searchTexts=prgst_' + programStageId + '_' + statusEvent + '_' + startDueDate + '_' + endDueDate;
	}
	
	jQuery( '#advancedSearchTB tr' ).each( function( i, row ){
		var dateOperator = "";
		var p = "";
		jQuery( this ).find(':input').each( function( idx, item ){
			if( idx == 0){
				p = "&searchTexts=" + item.value;
			}
			else if( item.name == 'dateOperator'){
				dateOperator = item.value;
			}
			else if( item.name == 'searchText'){
				if( item.value!='')
				{
					p += "_";
					if ( dateOperator.length >0 ) {
						p += dateOperator + "'" +  item.value.toLowerCase() + "'";
					}
					else{
						p += htmlEncode( item.value.toLowerCase().replace(/^\s*/, "").replace(/\s*$/, "") );
					}
				}
				else {
					p = "";
				}
			}
		})
		params += p;
	});
		
	params += '&listAll=false';
	params += '&searchBySelectedOrgunit=' + byId('searchBySelectedOrgunit').checked;
	
	return params;
}

// ----------------------------------------------------------------------------
// Show patients
// ----------------------------------------------------------------------------

function isDeathOnChange()
{
	var isDeath = byId('isDead').checked;
	if(isDeath)
	{
		showById('deathDateTR');
	}
	else
	{
		hideById('deathDateTR');
	}
}

// ----------------------------------------------------------------
// Get Params form Div
// ----------------------------------------------------------------

function getParamsForDiv( patientDiv)
{
	var params = '';
	var dateOperator = '';
	jQuery("#" + patientDiv + " :input").each(function()
		{
			var elementId = $(this).attr('id');
			
			if( $(this).attr('type') == 'checkbox' )
			{
				var checked = jQuery(this).attr('checked') ? true : false;
				params += elementId + "=" + checked + "&";
			}
			else if( elementId =='dateOperator' )
			{
				dateOperator = jQuery(this).val();
			}
			else if( $(this).attr('type') != 'button' )
			{
				var value = "";
				if( jQuery(this).val()!= null && jQuery(this).val() != '' )
				{
					value = htmlEncode(jQuery(this).val());
				}
				if( dateOperator != '' )
				{
					value = dateOperator + "'" + value + "'";
					dateOperator = "";
				}
				params += elementId + "="+ value + "&";
			}
		});
		
	return params;
}

// -----------------------------------------------------------------------------
// View patient details
// -----------------------------------------------------------------------------

function showPatientDetails( patientId )
{
    $('#detailsInfo').load("getPatientDetails.action", 
		{
			id:patientId
		}
		, function( ){
		}).dialog({
			title: i18n_patient_details,
			maximize: true, 
			closable: true,
			modal:false,
			overlay:{background:'#000000', opacity:0.1},
			width: 450,
			height: 300
		});
}

function showPatientHistory( patientId )
{
	$('#detailsInfo').load("getPatientHistory.action", 
		{
			patientId:patientId
		}
		, function( ){
			
		}).dialog({
			title: i18n_patient_details_and_history,
			maximize: true, 
			closable: true,
			modal:false,
			overlay:{background:'#000000', opacity:0.1},
			width: 800,
			height: 520
		});
}

function exportPatientHistory( patientId, type )
{
	var url = "getPatientHistory.action?patientId=" + patientId + "&type=" + type;
	window.location.href = url;
}

var prefixId = 'ps_';
var COLOR_RED = "#fb4754";
var COLOR_GREEN = "#8ffe8f";
var COLOR_YELLOW = "#f9f95a";
var COLOR_LIGHTRED = "#fb6bfb";
var COLOR_LIGHT_RED = "#ff7676";
var COLOR_LIGHT_YELLOW = "#ffff99";
var COLOR_LIGHT_GREEN = "#ccffcc";
var COLOR_LIGHT_LIGHTRED = "#ff99ff";

function setEventColorStatus( elementId, status )
{
	status = eval(status);
	switch(status)
	{
		case 1:
			jQuery('#' + elementId ).css('border-color', COLOR_GREEN);
			jQuery('#' + elementId ).css('background-color', COLOR_LIGHT_GREEN);
			return;
		case 2:
		  jQuery('#' + elementId ).css('border-color', COLOR_LIGHTRED);
			jQuery('#' + elementId ).css('background-color', COLOR_LIGHT_LIGHTRED);
			return;
		case 3:
			jQuery('#' + elementId ).css('border-color', COLOR_YELLOW);
			jQuery('#' + elementId ).css('background-color', COLOR_LIGHT_YELLOW);
			return;
		case 4:
			jQuery('#' + elementId ).css('border-color', COLOR_RED);
			jQuery('#' + elementId ).css('background-color', COLOR_LIGHT_RED);
			return;
		default:
		  return;
	}
}


// -----------------------------------------------------------------------------
// check duplicate patient
// -----------------------------------------------------------------------------

function checkDuplicate( divname )
{
	$.postUTF8( 'validatePatient.action', 
		{
			fullName: jQuery( '#' + divname + ' [id=fullName]' ).val(),
			dobType: jQuery( '#' + divname + ' [id=dobType]' ).val(),
			gender: jQuery( '#' + divname + ' [id=gender]' ).val(),
			birthDate: jQuery( '#' + divname + ' [id=birthDate]' ).val(),        
			age: jQuery( '#' + divname + ' [id=age]' ).val()
		}, function( xmlObject, divname )
		{
			checkDuplicateCompleted( xmlObject, divname );
		});
}

function checkDuplicateCompleted( messageElement, divname )
{
	checkedDuplicate = true;    
	var type = jQuery(messageElement).find('message').attr('type');
	var message = jQuery(messageElement).find('message').text();
    
    if( type == 'success')
    {
    	showSuccessMessage(i18n_no_duplicate_found);
    }
    if ( type == 'input' )
    {
        showWarningMessage(message);
    }
    else if( type == 'duplicate' )
    {
    	showListPatientDuplicate( messageElement, true );
    }
}

function enableBtn(){
	var programIdAddPatient = getFieldValue('programIdAddPatient');
	if( programIdAddPatient!='' ){
		$.getJSON( 'loadReportProgramStages.action', 
		{
			programId: getFieldValue('programIdAddPatient')
		}, function( json )
		{	
			clearListById('programStageAddPatient');
			$('#programStageAddPatient').append("<option value=''>" + i18n_please_select_program_stage + "</option>");
			for ( i in json.programStages ) 
			{
				$('#programStageAddPatient').append("<option value='" + json.programStages[i].id + "'>" + json.programStages[i].name + "</option>");
			}
			enable('listPatientBtn');
			enable('addPatientBtn');
			enable('advancedSearchBtn');
			jQuery('#advanced-search :input').each( function( idx, item ){
				enable(this.id);
			});
			jQuery('#programStageAddPatientTR [name=statusEvent]').attr("disabled", true);
		});
	}
	else
	{
		
			
			disable('listPatientBtn');
			disable('addPatientBtn');
			disable('advancedSearchBtn');
			jQuery('#advanced-search :input').each( function( idx, item ){
				disable(this.id);
			});	
		
	}
}

function enableRadioButton( programId )
{
	var prorgamStageId = jQuery('#programStageAddPatient').val();
	if( prorgamStageId== ''){
		jQuery('#programStageAddPatientTR [name=statusEvent]').attr("disabled", true);
	}
	else{
		jQuery('#programStageAddPatientTR [name=statusEvent]').removeAttr("disabled");
	}
}

function showColorHelp()
{
	jQuery('#colorHelpDiv').dialog({
		title: i18n_color_quick_help,
		maximize: true, 
		closable: true,
		modal:false,
		width: 380,
		height: 250
	}).show('fast');
}

// ----------------------------------------------------------------------------
// Move stage-flow
// ----------------------------------------------------------------------------

function moveLeft( programInstanceFlowDiv ){
	jQuery("#" + programInstanceFlowDiv).animate({scrollLeft: "-=200"}, 'fast');
}

function moveRight(programInstanceFlowDiv){
	jQuery("#" + programInstanceFlowDiv).animate({scrollLeft: "+=200"}, 'fast');
}

// ----------------------------------------------------------------------------
// Create New Event
// ----------------------------------------------------------------------------

function showCreateNewEvent( programInstanceId, programStageId )
{
	setInnerHTML('createEventMessage_' + programInstanceId, '');
	jQuery('#createNewEncounterDiv_' + programInstanceId ).dialog({
			title: i18n_create_new_event,
			maximize: true, 
			closable: true,
			modal:false,
			overlay:{background:'#000000', opacity:0.1},
			width: 450,
			height: 160
		}).show('fast');
		
	if( programStageId != undefined )
	{
		jQuery('#repeatableProgramStageId').val(programStageId);
	}
	setSuggestedDueDate( programInstanceId );
}

function setSuggestedDueDate( programInstanceId )
{
	var standardInterval =  jQuery('#repeatableProgramStageId option:selected').attr('standardInterval');
	var date = new Date();
	var d = date.getDate() + eval(standardInterval);
	var m = date.getMonth();
	var y = date.getFullYear();
	var edate= new Date(y, m, d);
	jQuery( '#dueDateNewEncounter_' + programInstanceId ).datepicker( "setDate" , edate );
}

function closeDueDateDiv( programInstanceId )
{
	jQuery('#createNewEncounterDiv_' + programInstanceId).dialog('close');
}

//------------------------------------------------------
// Register Irregular-encounter
//------------------------------------------------------

function registerIrregularEncounter( programInstanceId, programStageId, programStageName, dueDate )
{
	setInnerHTML('createEventMessage_' + programInstanceId, '');
	jQuery.postJSON( "registerIrregularEncounter.action",
		{ 
			programInstanceId:programInstanceId,
			programStageId: programStageId, 
			dueDate: dueDate 
		}, 
		function( json ) 
		{   
			var programStageInstanceId = json.message;
			disableCompletedButton(false);
			
			var elementId = prefixId + programStageInstanceId;
			var flag = false;
			var programType = jQuery('.stage-object-selected').attr('type');
			
			jQuery("#programStageIdTR_" + programInstanceId + " input[name='programStageBtn']").each(function(i,item){
				var element = jQuery(item);
				var dueDateInStage = element.attr('dueDate');
				if( dueDate < dueDateInStage && !flag)
				{	
					jQuery('<td><input name="programStageBtn" '
						+ 'id="' + elementId + '" ' 
						+ 'psid="' + programStageId + '" '
						+ 'programType="' + programType + '" '
						+ 'psname="' + programStageName + '" '
						+ 'dueDate="' + dueDate + '" '
						+ 'value="'+ programStageName + ' ' + dueDate + '" '
						+ 'onclick="javascript:loadDataEntry(' + programStageInstanceId + ')" '
						+ 'type="button" class="stage-object" '
						+ '></td>'
						+ '<td><img src="images/rightarrow.png"></td>')
					.insertBefore(element.parent());
					setEventColorStatus( elementId, 3 );
					flag = true;
				}
			});
			
			if( !flag )
			{
				jQuery("#programStageIdTR_" + programInstanceId).append('<td><img src="images/rightarrow.png"></td>'
					+ '<td><input name="programStageBtn" '
					+ 'id="' + elementId + '" ' 
					+ 'psid="' + programStageId + '" '
					+ 'programType="' + programType + '" '
					+ 'psname="' + programStageName + '" '
					+ 'dueDate="' + dueDate + '" '
					+ 'value="'+ programStageName + ' ' + dueDate + '" '
					+ 'onclick="javascript:loadDataEntry(' + programStageInstanceId + ')" '
					+ 'type="button" class="stage-object" '
					+ '></td>');
				setEventColorStatus( elementId, 3 );
			}
			setInnerHTML('createEventMessage_' + programInstanceId,i18n_create_event_success);
		});
}

function disableCompletedButton( disabled )
{
	if(disabled){
		disable('completeBtn');
		disable('completeAndAddNewBtn');
		enable('uncompleteBtn');
		enable('uncompleteAndAddNewBtn');
	}
	else{
		enable('completeBtn');
		enable('completeAndAddNewBtn');
		disable('uncompleteBtn');
		disable('uncompleteAndAddNewBtn');
	}
}
