"use strict";

describe("Directive: switch-cell", () => {
  var f, DeviceData;
  beforeEach(module("homeuiApp"));
  beforeEach(module("homeuiApp.mqttDirectiveFixture"));

  beforeEach(inject(function (MqttDirectiveFixture, _DeviceData_, $compile) {
    f = new MqttDirectiveFixture("<switch-cell cell='dev2/fooSwitch'></switch-cell>");
    DeviceData = _DeviceData_;
    f.extClient.send("/devices/dev2/controls/fooSwitch/meta/type", "switch", true, 1);
    f.extClient.send("/devices/dev2/controls/fooSwitch", "1", true, 0);
    f.$scope.$digest();
  }));

  function checkbox () {
    return f.container.find(".cell.cell-switch input[type=checkbox]:visible");
  }

  function toggleSwitch () {
    return f.container.find(".cell.cell-switch .toggle-switch-animate:visible");
  }

  function isSwitchOn () {
    expect(toggleSwitch()).toExist();
    return toggleSwitch().hasClass("switch-on");
  }

  it("should set switch state according to the cell value", () => {
    expect(isSwitchOn()).toBe(true);
    f.extClient.send("/devices/dev2/controls/fooSwitch", "0", true, 0);
    f.$scope.$digest();
    expect(isSwitchOn()).toBe(false);
  });

  it("should display readonly fields as readonly checkboxes", () => {
    f.extClient.send("/devices/dev2/controls/fooSwitch/meta/readonly", "1", true, 1);
    f.$scope.$digest();
    expect(toggleSwitch()).not.toExist();
    expect(checkbox()).toExist();
    expect(checkbox().prop("readonly")).toBeTruthy();
    expect(checkbox()).toBeDisabled();

    expect(checkbox()).toBeChecked();
    f.extClient.send("/devices/dev2/controls/fooSwitch", "0", true, 0);
    f.$scope.$digest();
    expect(checkbox()).not.toBeChecked();
  });
});
