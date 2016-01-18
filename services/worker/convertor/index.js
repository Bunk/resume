'use strict';

const Pandoc = require( 'pdc' );

class Convertor {
    convert( content, opt ) {
        return new Promise( ( resolve, reject ) => {
            let inputFormat = parseFormat( opt.inputFormat, 'markdown' );
            let outputFormat = parseFormat( opt.outputFormat, 'html' );

            console.log( `Conversion : Starting : ${opt.inputFormat} => ${opt.outputFormat}` );
			Pandoc( content, inputFormat, outputFormat, function( err, result ) {

				if ( err ) {
                    console.log( `Conversion : Error`, err );
					return reject( err );
				}

                console.log( `Conversion : Success : ${opt.inputFormat} => ${opt.outputFormat}` );
				return resolve( result );
			} );
		} );

        function parseFormat ( format, def ) {
            switch ( format.toLowerCase() ) {
                case 'md': return 'markdown';
                case 'pdf': return 'pdf';
                case 'html': return 'html';
            }
            return def;
        }
    }
}

module.exports = new Convertor();
