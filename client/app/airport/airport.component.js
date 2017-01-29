'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './airport.routes';

export class AirportComponent {
    /*@ngInject*/

    constructor($http, $scope, socket) {
        this.$http = $http;
        this.socket = socket;

        this.airports = [];
        this.filteredAirports = [];

        this.displayCountries = [];
        this.displayCities = [];
        this.displayAirports = [];

        this.addedCountries = {};
        this.addedCities = {};
        this.addedAirports = {};

        this.country = '';
        this.city = '';
        this.airport = '';

        $scope.$on('$destroy', () => {
            socket.unsyncUpdates('airport');
        });

        window.contro = this;
    }

    $onInit() {
        this.getAirports().then(() => {
            this.socket.syncUpdates('airport', this.airports);
        });
    }

    getAirports() {
        return this.$http.post('/api/airports/reseed')
            .then(response => {
                this.airports = response.data.results;
                this.filterAirports();
            });
    }

    getFilteredAirports() {
        var country = this.country.toLowerCase();
        var city = this.city.toLowerCase();
        var airport = this.airport.toLowerCase();
        return this.airports
            .filter(a => (country.length < 3 || a.country.toLowerCase().indexOf(country) > -1)
                && (city.length < 3 || a.mainCity.toLowerCase().indexOf(city) > -1)
                && (airport.length < 3 || a.name.toLowerCase().indexOf(airport) > -1)).sort((a, b) => a.name.localeCompare(b.name));
    }

    getDisplayCountries() {
        var countries = {};
        return this.filteredAirports.reduce((arr, a) => {
            if (!countries[a.country]) {
                countries[a.country] = true;
                arr.push({
                    name: a.country
                });
            }
            return arr;
        }, []).sort((a, b) => a.name.localeCompare(b.name));
    }

    getDisplayCities() {
        if (this.country.length < 3) {
            return [];
        }
        var cities = {};
        return this.filteredAirports.reduce((arr, a) => {
            if (!cities[a.mainCity]) {
                cities[a.mainCity] = true;
                arr.push({
                    name: a.mainCity,
                    country: a.country
                });
            }
            return arr;
        }, []).sort((a, b) => a.name.localeCompare(b.name));
    }

    getDisplayAirports() {
        if (this.country.length < 3 || this.city.length < 3) {
            return [];
        } else {
            return this.filteredAirports.slice();
        }
    }

    filterAirports(input) {
        if (input) {
            this.airport = input;
        }
        this.filteredAirports = this.getFilteredAirports();
        this.displayCountries = this.getDisplayCountries();
        this.displayCities = this.getDisplayCities();
        this.displayAirports = this.getDisplayAirports();
    }

    filterCities(input) {
        if (input) {
            this.city = input;
        }
        this.airport = '';
        this.filterAirports();
    }

    filterCountries(input) {
        if (input) {
            this.country = input;
        }
        this.city = '';
        this.filterCities();
    }
}

export default angular.module('flightSearchApp.airport', [uiRouter])
    .config(routes)
    .component('airport', {
        template: require('./airport.html'),
        controller: AirportComponent,
        controllerAs: 'airportCtrl'
    })
    .name;
