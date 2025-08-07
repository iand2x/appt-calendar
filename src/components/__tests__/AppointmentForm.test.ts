import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppointmentForm from "../AppointmentForm.vue";
import type { Appointment } from "@/features/appointments/appointmentTypes";

describe("AppointmentForm", () => {
  it("should render form elements", () => {
    const wrapper = mount(AppointmentForm);

    expect(wrapper.find('input[type="date"]').exists()).toBe(true);
    expect(wrapper.find('input[type="time"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Dentist Name"]').exists()).toBe(
      true
    );
    expect(wrapper.find("select").exists()).toBe(true);
    expect(wrapper.find('textarea[placeholder="Notes"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('should show "Add" button text in create mode', () => {
    const wrapper = mount(AppointmentForm);

    expect(wrapper.find('button[type="submit"]').text()).toBe("Add");
  });

  it('should show "Update" button text in edit mode', () => {
    const wrapper = mount(AppointmentForm, {
      props: {
        isEditMode: true,
      },
    });

    expect(wrapper.find('button[type="submit"]').text()).toBe("Update");
  });

  it("should populate form with appointment data in edit mode", async () => {
    const mockAppointment: Appointment = {
      id: "1",
      date: "2024-01-15T14:30:00.000Z", // ISO string format
      dentist: "Dr. Smith",
      equipment: "Compressor",
      notes: "Regular checkup",
      createdBy: "user@example.com",
    };

    const wrapper = mount(AppointmentForm, {
      props: {
        appointment: mockAppointment,
        isEditMode: true,
      },
    });

    await wrapper.vm.$nextTick();

    const dateInput = wrapper.find('input[type="date"]')
      .element as HTMLInputElement;
    const dentistInput = wrapper.find('input[placeholder="Dentist Name"]')
      .element as HTMLInputElement;
    const equipmentSelect = wrapper.find("select").element as HTMLSelectElement;
    const notesTextarea = wrapper.find("textarea")
      .element as HTMLTextAreaElement;

    expect(dateInput.value).toBe("2024-01-15");
    expect(dentistInput.value).toBe("Dr. Smith");
    expect(equipmentSelect.value).toBe("Compressor");
    expect(notesTextarea.value).toBe("Regular checkup");
  });

  it("should emit submit event with form data", async () => {
    const wrapper = mount(AppointmentForm);

    // Fill out the form
    await wrapper.find('input[type="date"]').setValue("2024-01-15");
    await wrapper.find('input[type="time"]').setValue("14:30");
    await wrapper
      .find('input[placeholder="Dentist Name"]')
      .setValue("Dr. Johnson");
    await wrapper.find("select").setValue("Scanner");
    await wrapper.find("textarea").setValue("Dental scan appointment");

    // Submit the form
    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.emitted()).toHaveProperty("submit");
    const submitEvents = wrapper.emitted("submit");
    expect(submitEvents).toHaveLength(1);

    const formData = submitEvents![0][0] as {
      dentist: string;
      equipment: string;
      notes: string;
      date: string;
    };

    // With UTC timezone forced in test setup, this should be consistent
    expect(formData).toEqual({
      dentist: "Dr. Johnson",
      equipment: "Scanner",
      notes: "Dental scan appointment",
      date: "2024-01-15T14:30:00.000Z", // Should be consistent in UTC
    });
  });

  it("should require all required fields", () => {
    const wrapper = mount(AppointmentForm);

    const dateInput = wrapper.find('input[type="date"]');
    const timeInput = wrapper.find('input[type="time"]');
    const dentistInput = wrapper.find('input[placeholder="Dentist Name"]');
    const equipmentSelect = wrapper.find("select");

    expect(dateInput.attributes("required")).toBeDefined();
    expect(timeInput.attributes("required")).toBeDefined();
    expect(dentistInput.attributes("required")).toBeDefined();
    expect(equipmentSelect.attributes("required")).toBeDefined();
  });

  it("should have equipment options", () => {
    const wrapper = mount(AppointmentForm);
    const options = wrapper.find("select").findAll("option");

    expect(options).toHaveLength(5); // 1 disabled + 4 equipment options
    expect(options[1].text()).toBe("Compressor");
    expect(options[2].text()).toBe("Suction Machine");
    expect(options[3].text()).toBe("Scanner");
    expect(options[4].text()).toBe("Hygiene Equipment");
  });
});
