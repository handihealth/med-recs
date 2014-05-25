'use strict';

/* global define:true*/
/* global document:true */
define(['jquery', 'knockout', '../services/ehrService.js', '../models/medication.js'],
function ($, ko, EHRService, Medication) {
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

		self.showModalDoseStopped = function (med, event) {
			console.log('show modal function');
			var modal = document.getElementById('stoppedDoseModal');
			console.log('modal is ' + modal);
			ko.cleanNode(modal);
			ko.applyBindings(med, modal);
		};

		self.showModalDoseChanged = function (med, event) {
			console.log('show modal function');
			var modal = document.getElementById('changedDoseModal');
			console.log('modal is ' + modal);
			ko.cleanNode(modal);
			ko.applyBindings(med, modal);
		};

		self.addNewMedication = function () {
			var newMed = new Medication({value:'PAracetemol', dose:'1000mg'});
			newMed.userCreated(true);
			newMed.setStatus('Newly added', 'User note here');
			self.medications.push(newMed);
		};
	};
});
