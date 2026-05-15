"use client";

import { useState } from "react";
import Image from "next/image";

function getDisplayText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function getStatusClasses(status) {
  if (status === "disponible") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (status === "vendu") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  if (status === "non-disponible") {
    return "bg-slate-100 text-slate-700 border-slate-200";
  }

  return "bg-[var(--gray-soft)] text-slate-700 border-[var(--line)]";
}

function specItems(vehicle) {
  return [
    { label: "Année", value: getDisplayText(vehicle.annee) },
    { label: "Couleur", value: getDisplayText(vehicle.couleur) },
    { label: "Moteur", value: getDisplayText(vehicle.type_moteur) },
    { label: "Carburant", value: getDisplayText(vehicle.type_carb) },
    { label: "Transmission", value: getDisplayText(vehicle.type_transm) },
    { label: "État", value: getDisplayText(vehicle.ind_etat), tone: "status" },
  ];
}

export default function VehicleDetailView({ vehicle }) {
  const imageList = Array.from(
    new Set([vehicle.image, ...(Array.isArray(vehicle.images) ? vehicle.images : [])].filter(Boolean)),
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeImage = imageList[activeIndex] || "";

  function showImage(index) {
    if (!imageList.length) {
      return;
    }

    const lastIndex = imageList.length - 1;
    const boundedIndex = Math.min(Math.max(index, 0), lastIndex);
    setActiveIndex(boundedIndex);
  }

  function goToPreviousImage() {
    if (imageList.length <= 1) {
      return;
    }

    setActiveIndex((current) => (current === 0 ? imageList.length - 1 : current - 1));
  }

  function goToNextImage() {
    if (imageList.length <= 1) {
      return;
    }

    setActiveIndex((current) => (current === imageList.length - 1 ? 0 : current + 1));
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <button
            type="button"
            onClick={() => {
              if (activeImage) {
                setIsModalOpen(true);
              }
            }}
            className="panel block w-full rounded-[2rem] p-2 text-left"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-[var(--gray-soft)]">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={getDisplayText(vehicle.nom)}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              ) : null}

              {imageList.length > 1 ? (
                <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-xl text-white">‹</span>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-xl text-white">›</span>
                </div>
              ) : null}
            </div>
          </button>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {imageList.map((image, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={`${vehicle.id}-${index}`}
                  type="button"
                  onClick={() => showImage(index)}
                  className={`panel rounded-[1.2rem] p-1 transition ${
                    isActive ? "ring-2 ring-[var(--gold)]" : "hover:scale-[1.02]"
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[0.95rem] bg-[var(--gray-soft)]">
                    <Image
                      src={image}
                      alt={`${getDisplayText(vehicle.nom)} ${index + 1}`}
                      fill
                      unoptimized
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="panel rounded-[2rem] p-8">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
            {getDisplayText(vehicle.marque_nom)}{vehicle.marque_nom && vehicle.model_nom ? " • " : ""}{getDisplayText(vehicle.model_nom)}
          </p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold sm:text-5xl">
              {getDisplayText(vehicle.nom)}
            </h1>
            <p className="rounded-full bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-black">
              {getDisplayText(vehicle.annee)}
            </p>
          </div>

          <p className="mt-5 text-lg leading-8 text-slate-700">{getDisplayText(vehicle.description)}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {specItems(vehicle).map((item) => (
              <div key={item.label} className="rounded-[1.4rem] border border-[var(--line)] bg-white p-4">
                <p className="text-sm text-slate-500">{item.label}</p>
                {item.tone === "status" ? (
                  <span className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-semibold capitalize ${getStatusClasses(vehicle.ind_etat)}`}>
                    {item.value}
                  </span>
                ) : (
                  <p className="mt-1 text-lg font-semibold capitalize text-slate-900">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 p-4"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-slate-900"
            >
              Fermer
            </button>
            {imageList.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={goToPreviousImage}
                  className="absolute left-3 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl font-semibold text-slate-900"
                  aria-label="Image précédente"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={goToNextImage}
                  className="absolute right-3 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl font-semibold text-slate-900"
                  aria-label="Image suivante"
                >
                  ›
                </button>
              </>
            ) : null}
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] bg-black">
              <Image
                src={activeImage}
                alt={getDisplayText(vehicle.nom)}
                fill
                unoptimized
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {imageList.length > 1 ? (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {imageList.map((image, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={`modal-${vehicle.id}-${index}`}
                      type="button"
                      onClick={() => showImage(index)}
                      className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-[1rem] border ${
                        isActive ? "border-[var(--gold)]" : "border-white/20"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${getDisplayText(vehicle.nom)} ${index + 1}`}
                        fill
                        unoptimized
                        sizes="112px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}