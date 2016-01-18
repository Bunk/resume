'use strict';

const shortid = require( 'shortid' );

class Repository {

    constructor( data ) {
        this.data = data || {};
    }

    all() {
        let arr = [];
        Object.keys( this.data ).forEach( ( key ) => {
            arr.push( this.data[key] );
        } );
        return arr;
    }

    get( id ) {
        return this.data[id];
    }

    add( entity, key ) {
        entity.id = entity.id || shortid.generate();
        return this.data[key || entity.id] = entity;
    }

    remove( id ) {
        delete this.data[id];
    }

}

module.exports = Repository;
