import { Policy } from '../lib/types'

const globalPolicy: Policy = {
  AllowCrossOriginAuthPrompt: false,
  AllowFileSelectionDialogs: true,
  AllowOutdatedPlugins: true,
  AlternateErrorPagesEnabled: true,
  AlwaysAuthorizePlugins: true,
  AuthNegotiateDelegateWhitelist: 'foobar.example.com',
  AuthSchemes: 'basic,digest,ntlm,negotiate',
  AuthServerWhitelist: '*example.com,foobar.com,*baz',
  AutoFillEnabled: false,
  AutoSelectCertificateForUrls: [
    '{"pattern":"https://www.example.com","filter":{"ISSUER":{"CN":"certificate issuer name"}}}',
  ],
  BackgroundModeEnabled: true,
  BlockThirdPartyCookies: false,
  BookmarkBarEnabled: true,
  ClearSiteDataOnExit: true,
  CloudPrintProxyEnabled: true,
  CloudPrintSubmitEnabled: true,
  CookiesAllowedForUrls: ['http://www.example.com', '[*.]example.edu'],
  CookiesBlockedForUrls: ['http://www.example.com', '[*.]example.edu'],
  CookiesSessionOnlyForUrls: ['http://www.example.com', '[*.]example.edu'],
  CopyPreventionSettings: {
    disable: ['not-sensitive.example.com'],
    enable: ['*'],
    minimum_data_size: 100,
  },
  DefaultBrowserSettingEnabled: true,
  DefaultCookiesSetting: 1,
  DefaultGeolocationSetting: 0,
  DefaultImagesSetting: 1,
  DefaultJavaScriptSetting: 1,
  DefaultNotificationsSetting: 2,
  DefaultPluginsSetting: 1,
  DefaultPopupsSetting: 1,
  DefaultSearchProviderEnabled: true,
  DefaultSearchProviderEncodings: ['UTF-8', 'UTF-16', 'GB2312', 'ISO-8859-1'],
  DefaultSearchProviderIconURL: 'http://search.my.company/favicon.ico',
  DefaultSearchProviderInstantURL:
    'http://search.my.company/suggest?q={searchTerms}',
  DefaultSearchProviderKeyword: 'mis',
  DefaultSearchProviderName: 'Google',
  DefaultSearchProviderSearchURL:
    'http:www.google.com/cse?cx=partner-pub-6065445074637525:8941524350&q={searchTerms}',
  DefaultSearchProviderSuggestURL:
    'http://search.my.company/suggest?q={searchTerms}',
  DeveloperToolsDisabled: true,
  Disable3DAPIs: false,
  DisableAuthNegotiateCnameLookup: false,
  DisablePluginFinder: true,
  DisablePrintPreview: false,
  DisableSSLRecordSplitting: true,
  DisableSpdy: true,
  DisabledPlugins: ['Java', 'Shockwave Flash', 'Chrome PDF Viewer'],
  DisabledPluginsExceptions: ['Java', 'Shockwave Flash', 'Chrome PDF Viewer'],
  DisabledSchemes: ['file', 'mailto'],
  DiskCacheDir: '${user_home}/Chrome_cache',
  DiskCacheSize: 104857600,
  DnsPrefetchingEnabled: true,
  DownloadDirectory: '/home/${user_name}/Downloads',
  EditBookmarksEnabled: false,
  EnableAuthNegotiatePort: false,
  EnableOnlineRevocationChecks: false,
  EnabledPlugins: ['Java', 'Shockwave Flash', 'Chrome PDF Viewer'],
  EnterpriseWebStoreName: 'WidgCo Chrome Apps',
  EnterpriseWebStoreURL: 'http://company-intranet/chromeapps',
  ExtensionInstallBlacklist: ['extension_id1', 'extension_id2'],
  ExtensionInstallForcelist: [
    'lcncmkcnkcdbbanbjakcencbaoegdjlp;https://clients2.google.com/service/update2/crx',
  ],
  ExtensionInstallWhitelist: ['extension_id1', 'extension_id2'],
  GSSAPILibraryName: 'libgssapi_krb5.so.2',
  HideWebStorePromo: false,
  HomepageIsNewTabPage: false,
  HomepageLocation:
    'http:www.google.com/cse/home?cx=partner-pub-6065445074637525:8941524350',
  ImagesAllowedForUrls: ['http://www.example.com', '[*.]example.edu'],
  ImagesBlockedForUrls: ['http://www.example.com', '[*.]example.edu'],
  ImportBookmarks: true,
  ImportHistory: true,
  ImportHomepage: true,
  ImportSavedPasswords: true,
  ImportSearchEngine: false,
  IncognitoModeAvailability: 1,
  InstantEnabled: true,
  JavaScriptAllowedForUrls: ['http://www.example.com', '[*.]example.edu'],
  JavaScriptBlockedForUrls: ['http://www.example.com', '[*.]example.edu'],
  MaxConnectionsPerProxy: 32,
  MediaCacheSize: 104857600,
  MetricsReportingEnabled: true,
  NotificationsAllowedForUrls: ['http://www.example.com', '[*.]example.edu'],
  NotificationsBlockedForUrls: ['http://www.example.com', '[*.]example.edu'],
  PasswordManagerAllowShowPasswords: false,
  PasswordManagerEnabled: false,
  PluginsAllowedForUrls: ['http://www.example.com', '[*.]example.edu'],
  PluginsBlockedForUrls: ['http://www.example.com', '[*.]example.edu'],
  PopupsAllowedForUrls: ['http://www.example.com', '[*.]example.edu'],
  PopupsBlockedForUrls: ['http://www.example.com', '[*.]example.edu'],
  PrintingEnabled: true,
  ProxyBypassList:
    'http://www.example1.com,http://www.example2.com,http://internalsite/',
  ProxyMode: 'direct',
  ProxyPacUrl: 'http://internal.site/example.pac',
  ProxyServer: '123.123.123.123:8080',
  RemoteAccessHostFirewallTraversal: false,
  RestoreOnStartup: 4,
  RestoreOnStartupURLs: [
    'http:www.google.com/cse?cx=partner-pub-6065445074637525:8941524350',
  ],
  SafeBrowsingEnabled: true,
  SavingBrowserHistoryDisabled: true,
  SearchSuggestEnabled: true,
  SharedClipboardEnabled: true,
  ShowHomeButton: true,
  SyncDisabled: true,
  TranslateEnabled: false,
  URLBlacklist: [
    'example.com',
    'https://ssl.server.com',
    'hosting.com/bad_path',
    'http://server:8080/path',
    '.exact.hostname.com',
    '*',
  ],
  URLWhitelist: [
    'example.com',
    'https://ssl.server.com',
    'hosting.com/bad_path',
    'http://server:8080/path',
    '.exact.hostname.com',
  ],
}

export { globalPolicy }
