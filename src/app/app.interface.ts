export class AppSettings {
   public static apiEndpoint: "http://186.167.32.27:81/maraveca/public/index.php/api/";
}

export interface IAppConfig {
    apiEndpoint: string;
}

export const AppConfig: IAppConfig = {
    apiEndpoint: "http://186.167.32.27:81/maraveca/public/index.php/api/"
};
