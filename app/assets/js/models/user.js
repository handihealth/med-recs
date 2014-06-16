'use strict';

/* global define:true*/
define(['knockout'],
function (ko) {
	return function (params) {
		var self = this;
		params = params || {firstNames:'', lastNames:'', gender:''};
		self.firstNames = ko.observable(params.firstNames);
		self.lastNames = ko.observable(params.lastNames);
		self.age = ko.observable(26);
		self.gender = ko.observable(params.gender);

		self.fullName = ko.computed(function () {
			return self.firstNames() + ' ' + self.lastNames();
		});

	};
});