/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	function getListElement( editor, listTag ) {
		var range;
		try {
			range = editor.getSelection().getRanges()[ 0 ];
		} catch ( e ) {
			return null;
		}

		range.shrink( CKEDITOR.SHRINK_TEXT );
		return editor.elementPath( range.getCommonAncestor() ).contains( listTag, 1 );
	}

	var listItem = function( node ) {
			return node.type == CKEDITOR.NODE_ELEMENT && node.is( 'li' );
		};

	var mapListStyle = {
		'a': 'lower-alpha',
		'A': 'upper-alpha',
		'i': 'lower-roman',
		'I': 'upper-roman',
		'1': 'decimal',
		'disc': 'disc',
		'circle': 'circle',
		'square': 'square'
	};

	function listStyle( editor, startupPage ) {
		var lang = editor.lang.listitemstyle;
		if ( startupPage == 'bulletedListStyle' ) {
			return {
				title: lang.bulletedTitle,
				minWidth: 300,
				minHeight: 50,
				getModel: generateModelGetter( editor, 'ul' ),
				contents: [ {
					id: 'info',
					accessKey: 'I',
					elements: [ {
						type: 'select',
						label: lang.type,
						id: 'type',
						align: 'center',
						style: 'width:150px',
						items: [
							[ lang.notset, '' ],
							[ lang.circle, 'circle' ],
							[ lang.disc, 'disc' ],
							[ lang.square, 'square' ]
						],
						setup: function( element ) {
							var value = element.getStyle( 'list-style-type' ) || mapListStyle[ element.getAttribute( 'type' ) ] || element.getAttribute( 'type' ) || '';

							this.setValue( value );
						},
						commit: function( element ) {
							var value = this.getValue();
							if ( value )
								element.setStyle( 'list-style-type', value );
							else
								element.removeStyle( 'list-style-type' );
						}
					} ]
				} ],
				onShow: function() {
					var editor = this.getParentEditor(),
						element = getListElement( editor, 'ul' );

					element && this.setupContent( element );
				},
				onOk: function() {
					var editor = this.getParentEditor(),
						element = getListElement( editor, 'ul' );

					element && this.commitContent( element );
				}
			};
		} else if ( startupPage == 'numberedListStyle' ) {

			var listStyleOptions = [
				[ lang.notset, '' ],
                [ lang.decimal, 'decimalDot' ],
                [ lang.decimalCircle, 'decimalCircle' ],
				[ lang.lowerAlpha, 'lowerAlpha' ],
				[ lang.upperAlpha, 'upperAlpha' ]
			];
			var validClasses = ['decimalDot', 'decimalCircle', 'lowerAlpha', 'upperAlpha'];

			return {
				title: lang.numberedTitle,
				minWidth: 300,
				minHeight: 50,
				getModel: generateModelGetter( editor, 'ol' ),
				contents: [ {
					id: 'info',
					accessKey: 'I',
					elements: [ {
						type: 'hbox',
						widths: [ '25%', '75%' ],
						children: [
						{
							type: 'select',
							label: lang.type,
							id: 'type',
							style: 'width: 100%;',
							items: listStyleOptions,
							setup: function( element ) {
							    for (var i = 0; i < validClasses.length; i++) {
							        if (element.hasClass(validClasses[i])) {
							            this.setValue(validClasses[i]);
                                    }
                                }
							},
							commit: function( element ) {
							    var value = this.getValue();
							    for (var i = 0; i < validClasses.length; i++) {
							        element.removeClass(validClasses[i]);
                                }
								if ( value ) {
                                    element.addClass(value);
                                }
							}
						} ]
					} ]
				} ],
				onShow: function() {
					var editor = this.getParentEditor(),
						element = getListElement( editor, 'ol' );

					element && this.setupContent( element );
				},
				onOk: function() {
					var editor = this.getParentEditor(),
						element = getListElement( editor, 'ol' );

					element && this.commitContent( element );
				}
			};
		}
	}

	CKEDITOR.dialog.add( 'numberedListStyle', function( editor ) {
		return listStyle( editor, 'numberedListStyle' );
	} );

	CKEDITOR.dialog.add( 'bulletedListStyle', function( editor ) {
		return listStyle( editor, 'bulletedListStyle' );
	} );

	function generateModelGetter( editor, tagName ) {
		return function() {
			return getListElement( editor, tagName ) || null;
		};
	}
} )();
