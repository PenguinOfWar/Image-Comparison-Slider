/* global jQuery */
/* global $ */

jQuery(document).ready(function($){
    'use strict';
    //check if the .cd-image-container is in the viewport 
    //if yes, animate it
    checkPosition($('.cd-image-container'));
    $(window).on('scroll', function(){
        checkPosition($('.cd-image-container'));
    });
    
    //make the .cd-handle element draggable and modify .cd-resize-img width according to its position
    $('.cd-image-container').each(function(){
        var actual = $(this);
        drags(actual.find('.cd-handle'), actual.find('.cd-resize-img'), actual, actual.find('.cd-image-label[data-type="original"]'), actual.find('.cd-image-label[data-type="modified"]'));
    });

    //upadate images label visibility
    $(window).on('resize', function(){
        $('.cd-image-container').each(function(){
            var actual = $(this);
            updateLabel(actual.find('.cd-image-label[data-type="modified"]'), actual.find('.cd-resize-img'), 'left');
            updateLabel(actual.find('.cd-image-label[data-type="original"]'), actual.find('.cd-resize-img'), 'right');
        });
    });
    
    /* no select for the slider */

	$(function(){
		$.extend($.fn.disableTextSelect = function() {
            
            /* remove $.browser as it is deprecated in jQuery > 1.9 and replace it with navigator.userAgent */
            var sUsrAg = navigator.userAgent;
			return this.each(function(){
				if( sUsrAg.indexOf("Firefox") > -1 ){//Firefox
					$(this).css('MozUserSelect','none');
				}else if( sUsrAg.indexOf("MSIE") > -1 ){//IE
					$(this).bind('selectstart',function(){return false;});
				}else{//Opera, etc.
					$(this).mousedown(function(){return false;});
				}
			});
		});
		$('.noSelect').disableTextSelect();//No text selection on elements with a class of 'noSelect'
	});
});

function checkPosition(container) {
    'use strict';
    container.each(function(){
        var actualContainer = $(this);
        if( $(window).scrollTop() + $(window).height()*0.5 > actualContainer.offset().top) {
            actualContainer.addClass('is-visible');
        }
    });
}

//draggable funtionality - credits to http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
function drags(dragElement, resizeElement, container, labelContainer, labelResizeElement) {
    'use strict';
    
    var leftValue;
	var widthValue;
	
	dragElement.on('mousedown vmousedown', function(e) {
        dragElement.addClass('draggable');
        resizeElement.addClass('resizable');
		
		var dragElementOffset = ($('.draggable').outerWidth() / 2);
 
        var dragWidth = dragElement.outerWidth(),
            xPosition = dragElement.offset().left + dragWidth - e.pageX,
            containerOffset = container.offset().left,
            containerWidth = container.outerWidth(),
            minLeft = containerOffset - dragElementOffset,
            maxLeft = containerOffset + containerWidth - dragWidth + dragElementOffset;
        
        dragElement.parents().on('mousemove vmousemove', function(e) {
			
            leftValue = e.pageX + xPosition - dragWidth;
            
			//constrain the draggable element to move inside its container
            if(leftValue < minLeft ) {
                leftValue = minLeft;
            } else if ( leftValue > maxLeft) {
                leftValue = maxLeft;
            }
 
            widthValue = (leftValue + dragWidth/2 - containerOffset)*100/containerWidth+'%';
            
            $('.draggable').css('left', widthValue).on('mouseup vmouseup', function() {
                $(this).removeClass('draggable');
                resizeElement.removeClass('resizable');
            });
 
            $('.resizable').css('width', widthValue); 
            
        }).on('mouseup vmouseup', function(e){
            dragElement.removeClass('draggable');
            resizeElement.removeClass('resizable');
			e.preventDefault();
        });
    }).on('mouseup vmouseup', function(e) {
        dragElement.removeClass('draggable');
        resizeElement.removeClass('resizable');
		e.preventDefault();
    });
}

function updateLabel(label, resizeElement, position) {
    'use strict';
    if(position == 'left') {
        ( label.offset().left + label.outerWidth() < resizeElement.offset().left + resizeElement.outerWidth() ) ? label.removeClass('is-hidden') : label.addClass('is-hidden') ;
    } else {
        ( label.offset().left > resizeElement.offset().left + resizeElement.outerWidth() ) ? label.removeClass('is-hidden') : label.addClass('is-hidden') ;
    }
}