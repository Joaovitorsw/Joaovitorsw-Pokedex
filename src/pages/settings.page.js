import { UserSettingsComponent } from "../components/user-settings/user-settings.component";

export class SettingsPage {
  constructor() {
    this.declarations = [UserSettingsComponent];
  }
  async getTemplate() {
    const $settingsPage = document.createElement("user-settings");
    return $settingsPage;
  }

  resetPage() {}
}
