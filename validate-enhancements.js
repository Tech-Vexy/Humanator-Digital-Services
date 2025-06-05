#!/usr/bin/env node

/**
 * Website Enhancement Validation Script
 * Tests all the improvements made to Humanator Digital Services website
 */

const fs = require('fs');
const path = require('path');

class WebsiteValidator {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            warnings: 0,
            details: []
        };
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
        
        this.results.details.push({
            timestamp,
            type,
            message
        });

        if (type === 'pass') this.results.passed++;
        if (type === 'fail') this.results.failed++;
        if (type === 'warn') this.results.warnings++;
    }

    checkFileExists(filePath, description) {
        if (fs.existsSync(filePath)) {
            this.log(`✅ ${description}: ${filePath}`, 'pass');
            return true;
        } else {
            this.log(`❌ ${description}: ${filePath} - FILE NOT FOUND`, 'fail');
            return false;
        }
    }

    checkFileContent(filePath, searchString, description) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes(searchString)) {
                this.log(`✅ ${description} found in ${path.basename(filePath)}`, 'pass');
                return true;
            } else {
                this.log(`❌ ${description} NOT found in ${path.basename(filePath)}`, 'fail');
                return false;
            }
        } catch (error) {
            this.log(`❌ Error reading ${filePath}: ${error.message}`, 'fail');
            return false;
        }
    }

    validateHTML(filePath) {
        const fileName = path.basename(filePath);
        this.log(`🔍 Validating ${fileName}...`, 'info');

        // Check for enhanced meta tags
        this.checkFileContent(filePath, 'property="og:title"', 'Open Graph meta tags');
        this.checkFileContent(filePath, 'twitter:card', 'Twitter Card meta tags');
        this.checkFileContent(filePath, '@context', 'Structured data (JSON-LD)');
        
        // Check for CSS file links
        this.checkFileContent(filePath, 'performance.css', 'Performance CSS');
        this.checkFileContent(filePath, 'security.css', 'Security CSS');
        
        // Check for accessibility features
        this.checkFileContent(filePath, 'skip-link', 'Skip navigation link');
        this.checkFileContent(filePath, 'main-content', 'Main content landmark');
        
        // Check for PWA features
        this.checkFileContent(filePath, 'manifest.json', 'PWA Manifest');
        this.checkFileContent(filePath, 'theme-color', 'Theme color meta tag');
        
        // Check for monitoring script
        this.checkFileContent(filePath, 'monitor.js', 'Monitoring script');
    }

    validateCSS(filePath) {
        const fileName = path.basename(filePath);
        this.log(`🎨 Validating ${fileName}...`, 'info');

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check for CSS syntax issues (basic check)
            const braceOpen = (content.match(/{/g) || []).length;
            const braceClose = (content.match(/}/g) || []).length;
            
            if (braceOpen === braceClose) {
                this.log(`✅ CSS syntax check passed for ${fileName}`, 'pass');
            } else {
                this.log(`❌ CSS syntax check failed for ${fileName} - Mismatched braces`, 'fail');
            }
            
            // Check for modern CSS features
            if (fileName === 'performance.css') {
                this.checkFileContent(filePath, 'will-change', 'GPU acceleration properties');
                this.checkFileContent(filePath, 'contain:', 'CSS containment');
                this.checkFileContent(filePath, 'lazy', 'Lazy loading styles');
            }
            
            if (fileName === 'security.css') {
                this.checkFileContent(filePath, 'csp-', 'CSP-related styles');
                this.checkFileContent(filePath, 'privacy', 'Privacy control styles');
            }
            
        } catch (error) {
            this.log(`❌ Error validating CSS ${fileName}: ${error.message}`, 'fail');
        }
    }

    validateJS(filePath) {
        const fileName = path.basename(filePath);
        this.log(`📜 Validating ${fileName}...`, 'info');

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check for modern JavaScript features
            if (fileName === 'main.js') {
                this.checkFileContent(filePath, 'addEventListener', 'Event listeners');
                this.checkFileContent(filePath, 'try {', 'Error handling');
                this.checkFileContent(filePath, 'performance.', 'Performance monitoring');
            }
            
            if (fileName === 'monitor.js') {
                this.checkFileContent(filePath, 'WebsiteMonitor', 'Monitoring class');
                this.checkFileContent(filePath, 'performance.observer', 'Performance observer');
                this.checkFileContent(filePath, 'analytics', 'Analytics functionality');
            }
            
        } catch (error) {
            this.log(`❌ Error validating JS ${fileName}: ${error.message}`, 'fail');
        }
    }

    async runValidation() {
        this.log('🚀 Starting Website Enhancement Validation...', 'info');
        this.log('===============================================', 'info');

        // 1. Check for essential files
        this.log('📁 Checking file structure...', 'info');
        
        const htmlFiles = [
            './index.html',
            './about.html', 
            './contact.html',
            './services.html'
        ];
        
        const cssFiles = [
            './css/performance.css',
            './css/security.css',
            './css/style.css',
            './css/professional-theme.css'
        ];
        
        const jsFiles = [
            './script/main.js',
            './script/monitor.js'
        ];

        // Check HTML files
        for (const file of htmlFiles) {
            if (this.checkFileExists(file, 'HTML file')) {
                this.validateHTML(file);
            }
        }

        // Check CSS files
        for (const file of cssFiles) {
            if (this.checkFileExists(file, 'CSS file')) {
                this.validateCSS(file);
            }
        }

        // Check JS files
        for (const file of jsFiles) {
            if (this.checkFileExists(file, 'JavaScript file')) {
                this.validateJS(file);
            }
        }

        // Check other important files
        this.checkFileExists('./sw.js', 'Service Worker');
        this.checkFileExists('./manifest.json', 'PWA Manifest');
        this.checkFileExists('./ENHANCEMENT_SUMMARY.md', 'Enhancement Documentation');

        // Generate final report
        this.generateReport();
    }

    generateReport() {
        this.log('===============================================', 'info');
        this.log('📊 VALIDATION SUMMARY', 'info');
        this.log('===============================================', 'info');
        
        this.log(`✅ Tests Passed: ${this.results.passed}`, 'info');
        this.log(`❌ Tests Failed: ${this.results.failed}`, 'info');
        this.log(`⚠️  Warnings: ${this.results.warnings}`, 'info');
        
        const total = this.results.passed + this.results.failed;
        const successRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;
        
        this.log(`📈 Success Rate: ${successRate}%`, 'info');
        
        if (this.results.failed === 0) {
            this.log('🎉 ALL VALIDATIONS PASSED! Website enhancement is complete and ready for deployment.', 'info');
        } else {
            this.log('⚠️  Some validations failed. Please review the issues above before deployment.', 'warn');
        }

        // Save detailed report
        const reportData = {
            timestamp: new Date().toISOString(),
            summary: {
                passed: this.results.passed,
                failed: this.results.failed,
                warnings: this.results.warnings,
                successRate: `${successRate}%`
            },
            details: this.results.details
        };

        try {
            fs.writeFileSync('validation-report.json', JSON.stringify(reportData, null, 2));
            this.log('📄 Detailed report saved to validation-report.json', 'info');
        } catch (error) {
            this.log(`❌ Could not save report: ${error.message}`, 'fail');
        }
    }
}

// Run validation if this script is executed directly
if (require.main === module) {
    const validator = new WebsiteValidator();
    validator.runValidation().catch(error => {
        console.error('Validation failed:', error);
        process.exit(1);
    });
}

module.exports = WebsiteValidator;
