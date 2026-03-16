(function () {

    'use strict';

    angular.module('adminportal.subsystems.reporting.reports.products.antispamsms', []);

    var ReportingReportsAntiSpamSMSModule = angular.module('adminportal.subsystems.reporting.reports.products.antispamsms');

    ReportingReportsAntiSpamSMSModule.config(function ($stateProvider) {

        $stateProvider.state('subsystems.reporting.reports.products.antispamsms', {
            abstract: true,
            url: "/antispam-sms",
            templateUrl: 'subsystems/reporting/reports/reporting.main.html',
            data: {
                pageHeaderKey: 'Subsystems.Reporting.ProductReports.AntiSpamSMS',
                onDemandState: 'subsystems.reporting.reports.products.antispamsms.report',
                scheduleState: 'subsystems.reporting.reports.products.antispamsms.schedule',
                permissions: [
                    'PRODUCTS_ANTISPAM'
                ]
            }
        }).state('subsystems.reporting.reports.products.antispamsms.report', {
            url: "/on-demand",
            templateUrl: 'subsystems/reporting/reports/reporting.formfields.ondemand.html',
            controller: 'ReportingReportsAntiSpamSMSCtrl'
        }).state('subsystems.reporting.reports.products.antispamsms.schedule', {
            url: "/schedule",
            templateUrl: 'subsystems/reporting/reports/reporting.formfields.schedule.html',
            controller: 'ReportingReportsAntiSpamSMSScheduleCtrl'
        });
    });

    /*

-rw-r--r--@  1 zeynepozsoy  staff   7740 Feb  6 14:51 AntiSpam_FilterUrl_Report.prpt
-rw-r--r--@  1 zeynepozsoy  staff   7423 Feb  6 14:51 AntiSpam_Rules_Report.prpt

-rw-r--r--@  1 zeynepozsoy  staff   9842 Feb  6 14:51 AntiSpam_Overall_Traffic_Report.prpt
-rw-r--r--@  1 zeynepozsoy  staff   9411 Feb  6 14:51 AntiSpam_Overall_Traffic_Report_Minutely.prpt
-rw-r--r--@  1 zeynepozsoy  staff   9148 Feb  6 14:51 AntiSpam_Overall_Traffic_by_Operator_Summary_Report.prpt
-rw-r--r--@  1 zeynepozsoy  staff  10978 Feb  6 14:51 AntiSpam_Overall_Traffic_by_Operator_Report.prpt
-rw-r--r--@  1 zeynepozsoy  staff   8014 Feb  6 14:51 AntiSpam_Overall_Traffic_by_Originator_MSC_GT_Summary_Report.prpt
-rw-r--r--@  1 zeynepozsoy  staff   8974 Feb  6 14:51 AntiSpam_Overall_Traffic_by_Originator_MSC_GT_Report.prpt

-rw-r--r--@  1 zeynepozsoy  staff   7819 Feb  6 14:51 AntiSpam_A2P_Traffic_by_Originator_MSC_GT_Summary_Report.prpt
-rw-r--r--@  1 zeynepozsoy  staff   8837 Feb  6 14:51 AntiSpam_A2P_Traffic_by_Originator_MSC_GT_Report.prpt
-rw-r--r--@  1 zeynepozsoy  staff   7886 Feb  6 14:51 AntiSpam_A2P_Traffic_by_Operator_Summary_Report.prpt
-rw-r--r--@  1 zeynepozsoy  staff   9478 Feb  6 14:51 AntiSpam_A2P_Traffic_by_Operator_Report.prpt
-rw-r--r--@  1 zeynepozsoy  staff   8751 Feb  6 14:51 AntiSpam_A2P_App_Traffic_by_Originator_MSC_GT_Report.prpt
-rw-r--r--@  1 zeynepozsoy  staff   9027 Feb  6 14:51 AntiSpam_A2P_App_Traffic_by_Operator_Report.prpt

-rw-r--r--@  1 zeynepozsoy  staff   8513 Feb  6 14:51 AntiSpam_MT_Inbound_Outbound_Traffic_by_Operator_Summary_Report.prpt
-rw-r--r--@  1 zeynepozsoy  staff   9883 Feb  6 14:51 AntiSpam_MT_Inbound_Outbound_Traffic_by_Operator_Report.prpt


-rw-r--r--@  1 zeynepozsoy  staff   9311 Feb  6 14:51 AntiSpam_Reject_Reason_Report.prpt
-rw-r--r--@  1 zeynepozsoy  staff   8456 Feb  6 14:51 AntiSpam_Reject_Reason_by_Originator_MSC_GT_Summary_Report.prpt
-rw-r--r--@  1 zeynepozsoy  staff   9467 Feb  6 14:51 AntiSpam_Reject_Reason_by_Originator_MSC_GT_Report.prpt
-rw-r--r--@  1 zeynepozsoy  staff   8903 Feb  6 14:51 AntiSpam_Reject_Reason_by_Operator_Summary_Report.prpt
-rw-r--r--@  1 zeynepozsoy  staff  10169 Feb  6 14:51 AntiSpam_Reject_Reason_by_Operator_Report.prpt

-rw-r--r--@  1 zeynepozsoy  staff   7436 Feb  6 14:51 AntiSpam_TopSRI_BParty_Spam_Report.prpt
-rw-r--r--@  1 zeynepozsoy  staff   7819 Feb  6 14:51 AntiSpam_TopGT_Report.prpt
drwxr-xr-x@ 25 zeynepozsoy  staff    800 Feb  6 14:54 .
drwx------@ 41 zeynepozsoy  staff   1312 Feb  9 21:47 ..
**/




    ReportingReportsAntiSpamSMSModule.controller('ReportingReportsAntiSpamSMSCtrl', function ($scope, $log, $controller, $filter, UtilService, SMS_ANTISPAM_REPORTING_FILTER_TYPES,
                                                                                              SMS_ANTISPAM_REPORTING_COUNTER_NAMES, SMS_ANTISPAM_REPORTING_OPERATORS) {
        $log.debug("ReportingReportsAntiSpamSMSCtrl");

        $controller('ReportingReportsAbstractCtrl', {$scope: $scope});

        $scope.SMS_ANTISPAM_REPORTING_FILTER_TYPES = SMS_ANTISPAM_REPORTING_FILTER_TYPES;
        $scope.SMS_ANTISPAM_REPORTING_COUNTER_NAMES = SMS_ANTISPAM_REPORTING_COUNTER_NAMES;
        $scope.SMS_ANTISPAM_REPORTING_OPERATORS = SMS_ANTISPAM_REPORTING_OPERATORS

        // General Reports
        var Antispam_FilterUrl_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_FilterUrl_Report.prpt');
        var Antispam_Rules_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_Rules_Report.prpt');

        // Traffic Reports
        var AntiSpam_Overall_Traffic_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_Overall_Traffic_Report.prpt');
        var AntiSpam_Overall_Traffic_Report_Minutely = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_Overall_Traffic_Report_Minutely.prpt');
        var AntiSpam_Overall_Traffic_by_Operator_Summary_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_Overall_Traffic_by_Operator_Summary_Report.prpt');
        var AntiSpam_Overall_Traffic_by_Operator_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_Overall_Traffic_by_Operator_Report.prpt');
        var AntiSpam_Overall_Traffic_by_Originator_MSC_GT_Summary_Report = [{ name: 'ALL', url: ':home:vcp:AntiSpam:AntiSpam_Overall_Traffic_by_Originator_MSC_GT_Summary_Report.prpt' }];
        var AntiSpam_Overall_Traffic_by_Originator_MSC_GT_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_Overall_Traffic_by_Originator_MSC_GT_Report.prpt');

        var AntiSpam_A2P_Traffic_by_Operator_Summary_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_A2P_Traffic_by_Operator_Summary_Report.prpt');
        var AntiSpam_A2P_Traffic_by_Operator_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_A2P_Traffic_by_Operator_Report.prpt');
        var AntiSpam_A2P_Traffic_by_Originator_MSC_GT_Summary_Report = [{ name: 'ALL', url: ':home:vcp:AntiSpam:AntiSpam_A2P_Traffic_by_Originator_MSC_GT_Summary_Report.prpt' }];
        var AntiSpam_A2P_Traffic_by_Originator_MSC_GT_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_A2P_Traffic_by_Originator_MSC_GT_Report.prpt');
        var AntiSpam_A2P_App_Traffic_by_Operator_Report = [{ name: 'ALL', url: ':home:vcp:AntiSpam:AntiSpam_A2P_App_Traffic_by_Operator_Report.prpt' }];
        var AntiSpam_A2P_App_Traffic_by_Originator_MSC_GT_Report = [{ name: 'ALL', url: ':home:vcp:AntiSpam:AntiSpam_A2P_App_Traffic_by_Originator_MSC_GT_Report.prpt' }];

         // GSM Reports
        var AntiSpam_MT_Inbound_Outbound_Traffic_by_Operator_Summary_Report = [{ name: 'ALL', url: ':home:vcp:AntiSpam:AntiSpam_MT_Inbound_Outbound_Traffic_by_Operator_Summary_Report.prpt' }];
        var AntiSpam_MT_Inbound_Outbound_Traffic_by_Operator_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_MT_Inbound_Outbound_Traffic_by_Operator_Report.prpt');
        // Reject Reason Reports
        var AntiSpam_Reject_Reason_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_Reject_Reason_Report.prpt');
        var AntiSpam_Reject_Reason_by_Operator_Summary_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_Reject_Reason_by_Operator_Summary_Report.prpt');
        var AntiSpam_Reject_Reason_by_Operator_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_Reject_Reason_by_Operator_Report.prpt');
        var AntiSpam_Reject_Reason_by_Originator_MSC_GT_Summary_Report = [{ name: 'ALL', url: ':home:vcp:AntiSpam:AntiSpam_Reject_Reason_by_Originator_MSC_GT_Summary_Report.prpt' }];
        var AntiSpam_Reject_Reason_by_Originator_MSC_GT_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_Reject_Reason_by_Originator_MSC_GT_Report.prpt');
        // Top GT Reports
        //var AntiSpam_TopGT_Summary_Report = [{ name: 'ALL', url: ':home:vcp:AntiSpam:AntiSpam_TopGT_Summary_Report.prpt' }];
        var AntiSpam_TopGT_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_TopGT_Report.prpt');
        var AntiSpam_TopSRI_BParty_Spam_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_TopSRI_BParty_Spam_Report.prpt');
        //var AntiSpam_TopSender_MSISDN_Report = UtilService.defineReportsAsDHM(':home:vcp:AntiSpam:AntiSpam_TopSender_MSISDN_Report.prpt');

        $scope.REPORTS = [
            // General Reports
            {group: 'General Reports', label: 'SMS Anti-Spam Filter URL Report', intervals: Antispam_FilterUrl_Report, additionalFields: ['filterType']},
            {group: 'General Reports', label: 'SMS Anti-Spam Rules Report', intervals: Antispam_Rules_Report},
            // Traffic Reports
            {group: 'Traffic Reports', label: 'SMS Anti-Spam Overall Traffic Report', intervals: AntiSpam_Overall_Traffic_Report},
            {group: 'Traffic Reports', label: 'SMS Anti-Spam Overall Traffic (Minutely) Report', intervals: AntiSpam_Overall_Traffic_Report_Minutely},
            {group: 'Traffic Reports', label: 'SMS Anti-Spam Overall Traffic by Operator Summary Report', intervals: AntiSpam_Overall_Traffic_by_Operator_Summary_Report},
            {group: 'Traffic Reports', label: 'SMS Anti-Spam Overall Traffic by Operator Report', intervals: AntiSpam_Overall_Traffic_by_Operator_Report, additionalFields: ['operatorFilter']},
            {group: 'Traffic Reports', label: 'SMS Anti-Spam Overall Traffic by Originator MSC GT Summary Report', intervals: AntiSpam_Overall_Traffic_by_Originator_MSC_GT_Summary_Report, additionalFields: ['requestLimit']},
            {group: 'Traffic Reports', label: 'SMS Anti-Spam Overall Traffic by Originator MSC GT Report', intervals: AntiSpam_Overall_Traffic_by_Originator_MSC_GT_Report, additionalFields: ['requestLimit', 'mscFilter']},

            {group: 'Traffic Reports', label: 'SMS Anti-Spam A2P Traffic by Operator Summary Report', intervals: AntiSpam_A2P_Traffic_by_Operator_Summary_Report},
            {group: 'Traffic Reports', label: 'SMS Anti-Spam A2P Traffic by Operator Report', intervals: AntiSpam_A2P_Traffic_by_Operator_Report, additionalFields: ['operatorFilter']},
            {group: 'Traffic Reports', label: 'SMS Anti-Spam A2P Traffic by Originator MSC GT Summary Report', intervals: AntiSpam_A2P_Traffic_by_Originator_MSC_GT_Summary_Report, additionalFields: ['requestLimit']},
            {group: 'Traffic Reports', label: 'SMS Anti-Spam A2P Traffic by Originator MSC GT Report', intervals: AntiSpam_A2P_Traffic_by_Originator_MSC_GT_Report, additionalFields: ['requestLimit', 'mscFilter']},
            {group: 'Traffic Reports', label: 'SMS Anti-Spam A2P App Traffic by Operator Report', intervals: AntiSpam_A2P_App_Traffic_by_Operator_Report, additionalFields: ['operatorFilter']},
            {group: 'Traffic Reports', label: 'SMS Anti-Spam A2P App Traffic by Originator MSC GT Report', intervals: AntiSpam_A2P_App_Traffic_by_Originator_MSC_GT_Report, additionalFields: ['mscFilter']},
            // GSM Reports
            {group: 'GSM Reports', label: 'SMS Anti-Spam MT Inbound / Outbound Traffic by Operator Summary Report', intervals: AntiSpam_MT_Inbound_Outbound_Traffic_by_Operator_Summary_Report},
            {group: 'GSM Reports', label: 'SMS Anti-Spam MT Inbound / Outbound Traffic by Operator Report', intervals: AntiSpam_MT_Inbound_Outbound_Traffic_by_Operator_Report, additionalFields: ['operatorFilter']},
            // Reject Reason Reports
            {group: 'Reject Reason Reports', label: 'SMS Anti-Spam Reject Reason Report', intervals: AntiSpam_Reject_Reason_Report},
            {group: 'Reject Reason Reports', label: 'SMS Anti-Spam Reject Reason by Operator Summary Report', intervals: AntiSpam_Reject_Reason_by_Operator_Summary_Report},
            {group: 'Reject Reason Reports', label: 'SMS Anti-Spam Reject Reason by Operator Report', intervals: AntiSpam_Reject_Reason_by_Operator_Report, additionalFields: ['operatorFilter']},
            {group: 'Reject Reason Reports', label: 'SMS Anti-Spam Reject Reason by Originator MSC GT Summary Report', intervals: AntiSpam_Reject_Reason_by_Originator_MSC_GT_Summary_Report},
            {group: 'Reject Reason Reports', label: 'SMS Anti-Spam Reject Reason by Originator MSC GT Report', intervals: AntiSpam_Reject_Reason_by_Originator_MSC_GT_Report, additionalFields: ['mscFilter']},
            // Top GT Reports
            {group: 'Top GT Reports', label: 'SMS Anti-Spam Top GT Report', intervals: AntiSpam_TopGT_Report, additionalFields: ['counterName']},
            {group: 'Top GT Reports', label: 'SMS Anti-Spam Top SRI B-Party Spam Report', intervals: AntiSpam_TopSRI_BParty_Spam_Report},
        ];

        $scope.reportCategory = $scope.REPORTS[0];
        $scope.interval = $scope.reportCategory.intervals[0];
        $scope.additionalParams = {
            filterType: null,
            operatorFilter: null,
            mscFilter: null,
            requestLimit: null,
            senderId: null,
            smscgtId: null,
            ruleName: null
        };
    });

    ReportingReportsAntiSpamSMSModule.controller('ReportingReportsAntiSpamSMSScheduleCtrl', function ($scope, $log, $controller) {
        $log.debug("ReportingReportsAntiSpamSMSScheduleCtrl");

        $controller('ReportingReportsAntiSpamSMSCtrl', {
            $scope: $scope
        });

        $controller('ReportingReportsScheduleCommonCtrl', {$scope: $scope});
    });

})();
