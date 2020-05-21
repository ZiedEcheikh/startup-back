/**
 * @author  Zied ECHEIKH
 * @since   18/12/2017
 * @version 1.0
 */
export class RestConfig {
    public static get APP_TITLE(): string { return 'Startup'; }
    public static get REST_AUTH_API_HOST(): string { return '/start/api/v1'; }
    public static get REST_MANAGE_API_HOST(): string { return '/manage/api/v1'; }
    public static get REST_FILES_API_HOST(): string { return '/files/api/v1'; }
    public static get FILES_HOST(): string { return 'http://192.168.80.128/images'; }
}
