"use client";

import { useEffect, useRef } from "react";
import { useDetailsDialog } from "../../components/details-dialog";
import { usePreferences } from "../../components/preferences";
import { portfolio } from "../../content/resume";
import { createIcons } from "../../local-icons";
import { createResumeUI } from "../../resume";
import Hero from "../../resume/sections/hero";
import Filters from "../../resume/sections/filters";
import Skills from "../../resume/sections/skills";
import Projects from "../../resume/sections/projects";
import Experience from "../../resume/sections/experience";
import Education from "../../resume/sections/education";
import Contact from "../../resume/sections/contact";

export function Portfolio() {
  const { locale } = usePreferences();
  const dialog = useDetailsDialog();
  const runtime = useRef(null);
  const openModal = useRef(null);

  useEffect(() => {
    openModal.current = dialog.open;
  }, [dialog.open]);
  useEffect(() => {
    const controller = new AbortController();
    const state = { locale: "fa", selectedRole: null, heroExpanded: false };
    const ui = createResumeUI({
      state,
      signal: controller.signal,
      getData: () => portfolio[state.locale],
      refreshIcons: () => createIcons(document.getElementById("resumePage")),
      openModal: (details) => openModal.current(details),
    });
    runtime.current = { state, ui };
    return () => {
      controller.abort();
      runtime.current = null;
    };
  }, []);
  useEffect(() => {
    const { state, ui } = runtime.current;
    state.locale = locale;
    const strings = portfolio[locale].ui.sections;
    for (const [key, label] of Object.entries(strings)) {
      const element = document.getElementById(`title${key[0].toUpperCase()}${key.slice(1)}`);
      if (element) element.textContent = label;
    }
    ui.render();
    createIcons(document.getElementById("resumePage"));
    if (location.hash.length > 1) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, [locale]);

  return (
    <>
      <Hero name={portfolio[locale].personal.name} />
      <Filters />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Contact />
    </>
  );
}
