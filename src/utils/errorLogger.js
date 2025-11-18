// utils/errorLogger.js

/**
 * Utilitário para logging estruturado de erros
 * Útil para debugging e monitoramento
 */

const LOG_LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
};

class ErrorLogger {
    static logApiError(error, context = {}) {
        if (__DEV__) {
            console.group('🔴 API Error');
            console.log('Context:', context);
            console.log('User Message:', context.userMessage || 'N/A');
            console.log('HTTP Status:', error.status || 'N/A');
            console.log('Original Error:', error);
            console.log('Timestamp:', new Date().toISOString());
            console.groupEnd();
        }

        // Em produção, você pode enviar para um serviço de monitoramento
        if (!__DEV__) {
            this.sendToMonitoringService({
                level: LOG_LEVELS.ERROR,
                message: context.userMessage || error.message,
                error: error,
                context: context,
                timestamp: new Date().toISOString()
            });
        }
    }

    static logAuthError(operation, error, userInfo = {}) {
        const context = {
            operation, // 'login', 'register', 'logout'
            userEmail: userInfo.email || 'N/A',
            userMessage: error.message || error,
            timestamp: new Date().toISOString()
        };

        this.logApiError(error, context);
    }

    static logValidationError(field, error, value = null) {
        if (__DEV__) {
            console.log(`🔶 Validation Error - ${field}:`, {
                error: error,
                value: value ? String(value).substring(0, 50) + '...' : 'N/A',
                timestamp: new Date().toISOString()
            });
        }
    }

    static logNetworkError(url, error) {
        if (__DEV__) {
            console.group('🌐 Network Error');
            console.log('URL:', url);
            console.log('Error:', error.message);
            console.log('Type:', error.name);
            console.log('Timestamp:', new Date().toISOString());
            console.groupEnd();
        }

        // Em produção, enviar para monitoramento
        if (!__DEV__) {
            this.sendToMonitoringService({
                level: LOG_LEVELS.ERROR,
                type: 'NETWORK_ERROR',
                url: url,
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    static logUserAction(action, details = {}) {
        if (__DEV__) {
            console.log('👤 User Action:', {
                action: action,
                details: details,
                timestamp: new Date().toISOString()
            });
        }
    }

    static sendToMonitoringService(errorData) {
        // Implementar integração com serviços como:
        // - Sentry
        // - Crashlytics
        // - LogRocket
        // - Bugsnag
        // etc.

        // Exemplo com Sentry:
        // Sentry.captureException(errorData.error, {
        //   tags: {
        //     level: errorData.level,
        //     type: errorData.type
        //   },
        //   extra: errorData
        // });

        console.log('📊 Would send to monitoring service:', errorData);
    }
}

export default ErrorLogger;

// Funções de conveniência para uso mais simples
export const logApiError = ErrorLogger.logApiError;
export const logAuthError = ErrorLogger.logAuthError;
export const logValidationError = ErrorLogger.logValidationError;
export const logNetworkError = ErrorLogger.logNetworkError;
export const logUserAction = ErrorLogger.logUserAction;