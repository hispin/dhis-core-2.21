function dataSetSelected()
{
	var dataSetId = $( '#dataSetId' ).val();	
	var periodFrom = $( '#sDateLB' ).val();
	var periodTo = $( '#eDateLB' ).val();
	
	if ( dataSetId && dataSetId != 0 )
	{
		var url = 'loadPeriods.action?dataSetId=' + dataSetId;

		var listStartPeriod = document.getElementById( 'sDateLB' );
		var listEndPeriod = document.getElementById( 'eDateLB' );
		
	    clearList( listStartPeriod );
		clearList( listEndPeriod );
	    
	    addOptionToList( listStartPeriod, '', '[' + i18n_please_select + ']' );
		addOptionToList( listEndPeriod, '', '[' + i18n_please_select + ']' );
		
	    $.getJSON( url, function( json ) {
			
	    	for ( i in json.periods ) {
	    		addOptionToList( listStartPeriod, i, json.periods[i].name );
				addOptionToList( listEndPeriod, i, json.periods[i].name );
	    	}
	    
			enable('previousPeriodForStartBtn');
			enable('nextPeriodForStartBtn');
			enable('previousPeriodForEndBtn');
			enable('nextPeriodForEndBtn');
	
	    } );
		
	}
	else
	{
		disable('previousPeriodForStartBtn');
		disable('nextPeriodForStartBtn');
		disable('previousPeriodForEndBtn');
		disable('nextPeriodForEndBtn');
	}
	
}

function getPreviousPeriodForStart() 
{
	var index = byId('sDateLB').options[byId('sDateLB').selectedIndex].value;
	jQuery.postJSON('previousPeriods.action?startField=true&index=' + index, responseListPeriodForStartReceived );	
}

function getNextPeriodForStart() 
{
	var index = byId('sDateLB').options[byId('sDateLB').selectedIndex].value;
	jQuery.postJSON('nextPeriods.action?startField=true&index=' + index, responseListPeriodForStartReceived );	
}

function responseListPeriodForStartReceived( json ) 
{	
	clearListById('sDateLB');
	
	jQuery.each( json.periods, function(i, item ){
		addOption('sDateLB', item.name , i );
	});
}

function getPreviousPeriodForEnd() 
{
	var index = byId('eDateLB').options[byId('eDateLB').selectedIndex].value;
	jQuery.postJSON('previousPeriods.action?startField=false&index=' + index, responseListPeriodForEndReceived );	
}

function getNextPeriodForEnd() 
{
	var index = byId('eDateLB').options[byId('eDateLB').selectedIndex].value;
	jQuery.postJSON('nextPeriods.action?startField=false&index=' + index, responseListPeriodForEndReceived );	
}

function responseListPeriodForEndReceived( json ) 
{	
	clearListById('eDateLB');
	
	jQuery.each( json.periods, function(i, item ){
		addOption('eDateLB', item.name , i );
	});
}


	