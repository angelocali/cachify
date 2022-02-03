function cachify_flush_icon_set_classes( icon_class, animate_class ) {
	var admin_bar_icon = document.querySelector( '#wp-admin-bar-cachify .ab-icon' )
	var classes = 'ab-icon dashicons ';
	if ( icon_class ) {
		if ( icon_class === 'animation-fade' ) {
			cachify_start_flush_icon_fade_removal_timeout()
		}
		classes += icon_class + ' ';
	}
	if ( animate_class ) {
		classes += animate_class + ' ';
	}

	admin_bar_icon.className = classes;
}

function cachify_start_flush_icon_fade_removal_timeout( admin_bar_icon ) {
	setTimeout( function () {
		cachify_flush_icon_set_classes( 'dashicons-trash', 'animate-fade' );
	}, 150 );	
}

function cachify_start_flush_icon_reset_timeout( admin_bar_icon ) {
	setTimeout( function () {
		cachify_flush_icon_set_classes( 'dashicons-trash', 'animate-fade' );
	}, 2000 );
}

function cachify_flush( event ) {
	event.preventDefault();

	var admin_bar_icon = document.querySelector( '#wp-admin-bar-cachify .ab-icon' );
	if ( admin_bar_icon.className.search( 'dashicons-trash' ) === -1 || admin_bar_icon.className.search( 'animate-pulse' ) !== -1 ) {
		return;
	}
	if ( admin_bar_icon !== null ) {
		cachify_flush_icon_set_classes( 'dashicons-trash', 'animate-pulse' );
	}

	var request = new XMLHttpRequest();
	request.addEventListener( 'load', function () {
		cachify_start_flush_icon_reset_timeout( admin_bar_icon );
		if ( this.status === 200 ) {
			cachify_flush_icon_set_classes( 'dashicons-yes-alt', 'animate-fade' );	
			return;
		}

		cachify_flush_icon_set_classes( 'dashicons-dismiss', 'animate-fade' );			
	});

	request.addEventListener( 'error', function () {
		cachify_start_flush_icon_reset_timeout( admin_bar_icon )
		cachify_flush_icon_set_classes( 'dashicons-dismiss', 'animate-fade' );
	});

	request.open( 'DELETE', cachify_admin_bar_flush_ajax_object.url );
	request.setRequestHeader( 'X-WP-Nonce', cachify_admin_bar_flush_ajax_object.nonce );
	request.send();
}

document.addEventListener( 'DOMContentLoaded', function () {
	var ab_item = document.querySelector( '#wp-admin-bar-cachify .ab-item' );
	ab_item.addEventListener( 'click', cachify_flush );
});