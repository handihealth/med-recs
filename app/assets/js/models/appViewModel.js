'use strict';

/* global define:true*/
/* global document:true */
define(['jquery', 'knockout', 'services/ehrService', 'models/medication', 'models/user'],
function ($, ko, EHRService, Medication, User) {
	return function () {
		var self = this;
		
		self.medications = ko.observableArray();

		self.loadStartingData = function () {
			self.ehr.getUKMedications(self.medications);
			self.ehr.getUserData(self.setUser);
		};

		self.setUser = function (userData) {
			console.log(userData);
			self.user(new User(userData));
			console.log('set user');
		};

		self.user = ko.observable(new User());
		self.status = ko.observable('active');
		self.ehr = new EHRService();
		self.ehr.login(self.loadStartingData);

		self.showModalDoseStopped = function (med) {
			console.log('show modal function');
			var modal = document.getElementById('stoppedDoseModal');
			console.log('modal is ' + modal);
			ko.cleanNode(modal);
			ko.applyBindings(med, modal);
		};

		self.showModalDoseChanged = function (med) {
			console.log('show modal function');
			var modal = document.getElementById('changedDoseModal');
			console.log('modal is ' + modal);
			ko.cleanNode(modal);
			ko.applyBindings(med, modal);
		};

		self.addNewMedication = function (name, dose, reason) {
			console.log('adding new med');
			var newMed = new Medication({value:name, dose:dose});
			newMed.userCreated(true);
			newMed.setStatus('Newly added', reason);
			self.medications.unshift(newMed);
		};

		self.sendData = function () {
			self.ehr.postUpdateMedications(self.medications());
		};
	};
});
