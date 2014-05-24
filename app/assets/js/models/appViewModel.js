'use strict';

/* global define:true*/
define(['jquery', 'knockout', '../services/ehrService.js'],
function ($, ko, EHRService) {
	return function () {
		var self = this;
		
		self.medications = ko.observableArray();

		self.loadMedications = function () {
			console.log('loading meds');
			self.ehr.getUKMedications(self.medications);
		}

		self.status = ko.observable('active');
		self.ehr = new EHRService();
		self.ehr.login(self.loadMedications);
	};
});
