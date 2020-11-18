$.fn.ISDCreateCalenderPlugin = function(SPObj)
{	
	var _obj = 
	{
		nextBRef: ($("#forwardbutton").length)? "#forwardbutton" : ($("#nextButton").length)? "#nextButton" : "#btn_continue",
		primeKey: (isNaN(this.prop("id").charAt(this.prop("id").length - 1)))? "_" : this.prop("id").substr(3,4) + "_",
		okLabel: "   OK   ",
		errMsg1: "Please Complete the first slot.",
		errMsg2: "Please select slots in accending order.",
		errMsg3: "You can not select same time slots for the same date.",
		errMsg4: "Please select the time slot for the selected date.",
		errMsg5: "Please select the date for the selected time slot.",
		errMsg6: "Please fill the slots in seq.",
		placeHolderDate: "Pick a date here",
		placeHolderTime: "Pick time slot here",
		cardArray: [1,2,3],
		cardText: [""], //Please pass the card text in the same order of precodes passed to the cardArray parameter//
		cardWidth: 350,
		cardHeight: 40,
		cardDistance: 15,
		posX: 0,
		posY: 1,
		finalData: -1,
		stageWidth: 0,
		oldViewportWidth: 0,
		finishFlag: true
	}
	$.extend(_obj, SPObj);

	_obj.stageWidth =  _obj.cardWidth+50;
	_obj.posX = Math.round((_obj.stageWidth - (_obj.cardArray.length * _obj.cardWidth + (_obj.cardArray.length - 1) * _obj.cardDistance))/2);
	if(_obj.posX < 0)
	{
		_obj.posX = 0;
		while(_obj.posX + _obj.cardWidth <= _obj.stageWidth)
		{
			_obj.posX += _obj.cardWidth + _obj.cardDistance;
		}
		_obj.stageWidth = _obj.posX - _obj.cardDistance + 6;
		_obj.posX = 2;
	}

	var rootDiv = $("<div>");
	rootDiv.prop({id: "rootDiv" + _obj.primeKey});
	rootDiv.css({width: _obj.stageWidth, height: 100, position: "relative"});
	rootDiv.addClass("example");
	this.html("");
	this.append(rootDiv);

	document.body.ondragstart = function(){return true};
	$(document.body).on("selectstart", function(){return false});
	$(_obj.nextBRef).css({visibility: "visible", display: "inline"});
	$(_obj.nextBRef).on("click", submitHandler);

	createCards();


	function createCards()
	{
		var card;
		var backG;
		var tick;
		var tickImg;
		var cardContent;
		var openEndBox;

		for(var i = 0; i < _obj.cardArray.length; i++)
		{
			card = $("<div>");
			card.prop({id: "card" + _obj.primeKey + _obj.cardArray[i], align: "center"});
			card.css({width: _obj.cardWidth, height: _obj.cardHeight, position: "absolute", left: _obj.posX, top: _obj.posY, display: "block"});
			card.data({cardPosX: _obj.posX, cardPosY: _obj.posY});
			$("#rootDiv" + _obj.primeKey).append(card);

			dateField = $("<input>");
			dateField.prop({id: "date" + _obj.primeKey + _obj.cardArray[i], type: "text", placeholder: _obj.placeHolderDate, "readonly": true});
			dateField.css({visibility: "visible", fontFamily: "Arial", fontSize: 13 + "px", width: 150, height: _obj.cardHeight-20, position: "absolute", left: 12, borderRadius: 5, border: "1px solid rgb(153, 153, 153)", boxShadow: "rgb(167, 167, 167) 0px 1px 1px inset", outline: "none", padding: "2px 5px"});
			card.append(dateField);

			timeField = $("<input>");
			timeField.prop({id: "time" + _obj.primeKey + _obj.cardArray[i], type: "text", placeholder: _obj.placeHolderTime, "readonly": true});
			timeField.css({visibility: "visible", fontFamily: "Arial", fontSize: 13 + "px", width: 150, height: _obj.cardHeight-20, position: "absolute", left: 180, borderRadius: 5, border: "1px solid rgb(153, 153, 153)", boxShadow: "rgb(167, 167, 167) 0px 1px 1px inset", outline: "none", padding: "2px 5px"});
			card.append(timeField);

			calenderInit(_obj.cardArray[i]);

			_obj.posY += _obj.cardHeight + _obj.cardDistance;

		}
		
		$("#rootDiv" + _obj.primeKey).css({height: card.position().top + _obj.cardHeight + 200});
	}

	function calenderInit(id){
		
			from = $("#date_"+id)
				.datepicker({
					dateFormat: 'dd/mm/yy',
					changeMonth: true,
					changeYear: true,
					minDate: '1/11/2020',
					maxDate: '31/1/2021',
					numberOfMonths: 1
			});

		 $('#time_'+id).timepicker({
		 	interval: 15,
		 	timeFormat: 'HH:mm'
		 });	
	}

	function submitHandler(pEvent)
	{
		var selectedDates = []; 
		var selectedTimes = []; 
		var finalSlots = []; 
		for(var i = 0; i < _obj.cardArray.length; i++)
		{
			selectedDates[i] = $("#date_"+_obj.cardArray[i]).val();
			selectedTimes[i] = $("#time_"+_obj.cardArray[i]).val();

		}

		for(var i = 0; i < selectedDates.length; i++){

			if (selectedDates[0] == "" || selectedDates[0] == " " || selectedDates[0] == undefined || selectedTimes[0] == "" || selectedTimes[0] == " " || selectedTimes[0] == undefined) {
				createDialog(_obj.errMsg1, _obj);
				$("#alertBoxContent" + _obj.primeKey).children().eq(5).prop("value", _obj.okLabel);
				if($("#rootDiv" + _obj.primeKey).height() > 200)
				{
					$("#alertBoxContent" + _obj.primeKey).css({top: $("#rootDiv" + _obj.primeKey).height() - 200});
				}
				return false;
			}
			if (i > 0) {
	

				if (selectedDates[i-1] == "" || selectedTimes[i-1] == "") {
					console.log(i);
					createDialog(_obj.errMsg6, _obj);
					$("#alertBoxContent" + _obj.primeKey).children().eq(5).prop("value", _obj.okLabel);
					if($("#rootDiv" + _obj.primeKey).height() > 200)
					{
						$("#alertBoxContent" + _obj.primeKey).css({top: $("#rootDiv" + _obj.primeKey).height() - 200});
					}
					return false;
				}

				if ((selectedDates[i] != "") && (selectedTimes[i] == "") ) {
					createDialog(_obj.errMsg4, _obj);
					$("#alertBoxContent" + _obj.primeKey).children().eq(5).prop("value", _obj.okLabel);
					if($("#rootDiv" + _obj.primeKey).height() > 200)
					{
						$("#alertBoxContent" + _obj.primeKey).css({top: $("#rootDiv" + _obj.primeKey).height() - 200});
					}					
					return false;
				} else if ((selectedDates[i] == "") && (selectedTimes[i] != "")) {
					createDialog(_obj.errMsg5, _obj);
					$("#alertBoxContent" + _obj.primeKey).children().eq(5).prop("value", _obj.okLabel);
					if($("#rootDiv" + _obj.primeKey).height() > 200)
					{
						$("#alertBoxContent" + _obj.primeKey).css({top: $("#rootDiv" + _obj.primeKey).height() - 200});
					}				
					return false;
				}

				var currentDateMDY = selectedDates[i].split("/")[1]+"/"+selectedDates[i].split("/")[0]+"/"+selectedDates[i].split("/")[2];
				var prevDateMDY = selectedDates[i-1].split("/")[1]+"/"+selectedDates[i-1].split("/")[0]+"/"+selectedDates[i-1].split("/")[2];
				var currentDate = Date.parse(new Date(currentDateMDY));
				var prevDate = Date.parse(new Date(prevDateMDY));

				if (currentDate < prevDate) {
					createDialog(_obj.errMsg2, _obj);
					$("#alertBoxContent" + _obj.primeKey).children().eq(5).prop("value", _obj.okLabel);
					if($("#rootDiv" + _obj.primeKey).height() > 200)
					{
						$("#alertBoxContent" + _obj.primeKey).css({top: $("#rootDiv" + _obj.primeKey).height() - 200});
					}
					return false;
				} else if (currentDate == prevDate) {
					if (selectedTimes[i] == selectedTimes[i-1]) {
						createDialog(_obj.errMsg3, _obj);
						$("#alertBoxContent" + _obj.primeKey).children().eq(5).prop("value", _obj.okLabel);
						if($("#rootDiv" + _obj.primeKey).height() > 200)
						{
							$("#alertBoxContent" + _obj.primeKey).css({top: $("#rootDiv" + _obj.primeKey).height() - 200});
						}
						return false;
					}				
				}
			}
			if (selectedDates[i] != "") {
				finalSlots.push(selectedDates[i]+"~"+selectedTimes[i]);
			}			
		}

		
		if(_obj.finishFlag)
		{
			_obj.finishFlag = false;
			window["setValue" + _obj.primeKey.slice(0,-1)](finalSlots);
		}
	}
}