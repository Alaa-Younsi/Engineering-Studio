import { useState } from 'react'
import { MediaFrame, Tag } from './MediaPlaceholder'
import { Reveal, RevealText } from './Reveal'
import { projects } from '../data/portefeuille'
import type { Project } from '../data/portefeuille'

function ProjectCard({ project }: { project: Project }) {
  const [active, setActive] = useState(0)
  const current = project.media[active] ?? project.media[0]

  return (
    <div className="bg-[#131313] rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8">

      {/* Title / location / tags */}
      <div className="lg:w-[24%] lg:flex-shrink-0 flex flex-col gap-6">
        <h3 className="font-display font-bold text-white text-xl sm:text-2xl leading-tight">{project.title}</h3>
        <div className="lg:mt-auto flex flex-col gap-5">
          <p className="font-body text-secondary text-xs leading-relaxed">
            {project.location.map(line => (
              <span key={line} className="block">{line}</span>
            ))}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
      </div>

      {/* Main media */}
      <MediaFrame
        src={current?.src}
        video={current?.type === 'video'}
        alt={project.title}
        className="flex-1 aspect-[16/10] rounded-xl sm:rounded-2xl"
        iconClassName="w-12 h-12"
      />

      {/* Thumbnail strip — a row on mobile, a column from lg up */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {project.media.map((media, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Voir le média ${i + 1} de ${project.title}`}
            aria-pressed={i === active}
            className={`flex-shrink-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition-opacity ${
              i === active ? 'opacity-100' : 'opacity-50 hover:opacity-80'
            }`}
          >
            <MediaFrame
              src={media.src}
              video={media.type === 'video'}
              className="w-16 h-12 lg:w-14 lg:h-11 rounded-lg"
              iconClassName="w-5 h-5"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

/** The project showcase that replaces the placeholder once FEATURES.portefeuille is on. */
export function PortefeuilleGallery() {
  return (
    <>
      <section className="relative flex items-center justify-center overflow-hidden py-32 px-6">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <img
            src="/Assets/logo/Logo-seul.png"
            alt=""
            className="w-[min(60vw,300px)] h-[min(60vw,300px)] object-contain"
            style={{ opacity: 0.14 }}
            draggable={false}
          />
        </div>
        <RevealText className="relative z-10">
          <h2 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-white text-center leading-tight max-w-[20ch]">
            Découvrez quelques-unes de nos réalisations
          </h2>
        </RevealText>
      </section>

      <section className="px-6 sm:px-10 lg:px-20 pb-32 flex flex-col gap-10 lg:gap-16">
        {projects.map((project, i) => (
          <Reveal key={project.id} direction={i % 2 === 0 ? 'left' : 'right'} className="max-w-screen-xl mx-auto w-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </section>
    </>
  )
}
