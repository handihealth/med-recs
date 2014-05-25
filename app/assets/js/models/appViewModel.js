'use strict';

/* global define:true*/
/* global document:true */
define(['jquery', 'knockout', '../services/ehrService.js'],
function ($, ko, EHRService) {
	return function () {
		var self = this;
		
		self.medications = ko.observableArray();

		self.loadMedications = function () {
			console.log('loading meds');
			self.ehr.getUKMedications(self.medications);
		};

		self.status = ko.observable('active');
		self.ehr = new EHRService();
		self.ehr.login(self.loadMedications);

		self.showModalDoseStopped = function () {
			console.log('show modal function');
			var modal = document.getElementById('stoppedDoseModal');
			console.log('modal is ' + modal);
			ko.cleanNode(modal);
			ko.applyBindings(self.medications()[0], modal);
		};
		
		self.showModalDoseChanged = function () {
			console.log('show modal function');
			var modal = document.getElementById('changedDoseModal');
			console.log('modal is ' + modal);
			ko.cleanNode(modal);
			ko.applyBindings(med, modal);
		};
	};
});
