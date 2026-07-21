'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

const TRANSITION_MS = 650
const INTERVAL_MS = 2800

export type FlipbookPhoto = {
  src: string
  alt?: string
}

export type FlipbookPageLayout = 'single' | 'spread' | 'adaptive'

type FlipbookSlide = FlipbookPhoto | FlipbookPhoto[]
type PhotoSize = { w: number; h: number }

function useLoadedImages(urls: string[]) {
  const urlsKey = urls.join('|')
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set())

  const markLoaded = useCallback((src: string) => {
    if (!src) return
    setLoaded((prev) => {
      if (prev.has(src)) return prev
      const next = new Set(prev)
      next.add(src)
      return next
    })
  }, [])

  useEffect(() => {
    const unique = [...new Set(urls.filter(Boolean))]
    if (unique.length === 0) return

    let cancelled = false

    unique.forEach((src) => {
      const img = new window.Image()
      const markLoaded = () => {
        if (cancelled) return
        setLoaded((prev) => {
          if (prev.has(src)) return prev
          const next = new Set(prev)
          next.add(src)
          return next
        })
      }

      img.onload = markLoaded
      img.onerror = markLoaded
      img.src = src
      if (img.complete) markLoaded()
    })

    return () => {
      cancelled = true
    }
  }, [urlsKey])

  return { loaded, markLoaded }
}

function isPortraitSize(size: PhotoSize) {
  return size.h > size.w
}

function isSpreadSlide(slide: FlipbookSlide): slide is FlipbookPhoto[] {
  return Array.isArray(slide)
}

function slidePhotos(slide: FlipbookSlide): FlipbookPhoto[] {
  return isSpreadSlide(slide) ? slide : [slide]
}

function slideIsReady(slide: FlipbookSlide, loaded: Set<string>) {
  return slidePhotos(slide).every((photo) => !photo.src || loaded.has(photo.src))
}

function slideSrcSet(slide: FlipbookSlide): Set<string> {
  return new Set(slidePhotos(slide).map((photo) => photo.src).filter(Boolean))
}

function slidesShareImage(a: FlipbookSlide, b: FlipbookSlide): boolean {
  const srcA = slideSrcSet(a)
  for (const photo of slidePhotos(b)) {
    if (photo.src && srcA.has(photo.src)) return true
  }
  return false
}

/** Remove duplicate src on the same spread; collapse to single page when needed */
function sanitizeSlide(slide: FlipbookSlide): FlipbookSlide {
  if (!isSpreadSlide(slide)) return slide

  const seen = new Set<string>()
  const unique = slide.filter((photo) => {
    if (!photo.src || seen.has(photo.src)) return false
    seen.add(photo.src)
    return true
  })

  if (unique.length === 0) return slide[0]
  if (unique.length === 1) return unique[0]
  return unique
}

/** Prefer the next page; if it repeats a photo, skip to at least the page after that */
function findNextSlideIndex(slides: FlipbookSlide[], currentIndex: number): number {
  if (slides.length <= 1) return 0

  const current = slides[currentIndex]
  const total = slides.length
  const immediate = (currentIndex + 1) % total

  if (!slidesShareImage(current, slides[immediate])) {
    return immediate
  }

  for (let offset = 2; offset < total; offset += 1) {
    const candidate = (currentIndex + offset) % total
    if (!slidesShareImage(current, slides[candidate])) {
      return candidate
    }
  }

  return immediate
}

function pickFillPhoto(
  photos: FlipbookPhoto[],
  primary: FlipbookPhoto,
  sizes: Map<string, PhotoSize>,
  skipIndices: Set<number>,
  startFrom = 0,
  portraitOnly = false,
  excludeSrcs?: Set<string>,
): { photo: FlipbookPhoto; index: number } | null {
  for (let pass = 0; pass < 2; pass += 1) {
    const from = pass === 0 ? startFrom : 0
    const to = pass === 0 ? photos.length : startFrom

    for (let j = from; j < to; j += 1) {
      if (skipIndices.has(j)) continue

      const candidate = photos[j]
      if (candidate.src === primary.src) continue
      if (excludeSrcs?.has(candidate.src)) continue

      const size = sizes.get(candidate.src)
      if (portraitOnly && size && !isPortraitSize(size)) continue

      return { photo: candidate, index: j }
    }
  }

  return null
}

function chunkIntoSpreads(photos: FlipbookPhoto[]): FlipbookSlide[] {
  if (photos.length === 0) return []

  const spreads: FlipbookSlide[] = []
  for (let i = 0; i < photos.length; i += 2) {
    const left = photos[i]
    const right = photos[i + 1]
    spreads.push(right ? [left, right] : left)
  }
  return spreads
}

function buildAdaptiveSlides(
  photos: FlipbookPhoto[],
  sizes: Map<string, PhotoSize>,
): FlipbookSlide[] {
  if (photos.length === 0) return []

  const slides: FlipbookSlide[] = []
  const consumed = new Set<number>()
  let previousSrcs = new Set<string>()

  for (let i = 0; i < photos.length; i += 1) {
    if (consumed.has(i)) continue

    const photo = photos[i]
    const size = sizes.get(photo.src)
    const portrait = size ? isPortraitSize(size) : true
    let slide: FlipbookSlide | null

    if (!portrait) {
      slide = photo
    } else {
      const skip = new Set([...consumed, i])
      const excludeSrcs = new Set([photo.src, ...previousSrcs])
      const match =
        pickFillPhoto(photos, photo, sizes, skip, i + 1, true, excludeSrcs) ??
        pickFillPhoto(photos, photo, sizes, skip, i + 1, false, excludeSrcs)

      if (match) {
        slide = [photo, match.photo]
        consumed.add(match.index)
      } else {
        slide = photo
      }
    }

    slide = sanitizeSlide(slide)

    if (slides.length > 0 && slidesShareImage(slides[slides.length - 1]!, slide)) {
      const prevSrcs = slideSrcSet(slides[slides.length - 1]!)
      if (isSpreadSlide(slide)) {
        const filtered = slide.filter((p) => p.src && !prevSrcs.has(p.src))
        slide =
          filtered.length === 0
            ? null
            : filtered.length === 1
              ? filtered[0]!
              : filtered
      } else if (slide.src && prevSrcs.has(slide.src)) {
        slide = null
      }
    }

    if (!slide) continue

    slides.push(slide)
    previousSrcs = slideSrcSet(slide)
  }

  return slides
}

function finalizeSlides(rawSlides: FlipbookSlide[]): FlipbookSlide[] {
  return rawSlides.map(sanitizeSlide).filter((slide) => slidePhotos(slide).some((photo) => photo.src))
}

function SinglePhotoPage({
  photo,
  priority,
  sizes,
  imageClassName,
  containerClassName,
  onPhotoClick,
  photoIndex,
  clickLabel,
  focusRingOffsetClass,
  isLoaded,
  onImageLoaded,
}: {
  photo: FlipbookPhoto
  priority?: boolean
  sizes: string
  imageClassName: string
  containerClassName: string
  onPhotoClick?: (photo: FlipbookPhoto, index: number) => void
  photoIndex: number
  clickLabel: string
  focusRingOffsetClass: string
  isLoaded: boolean
  onImageLoaded?: (src: string) => void
}) {
  const rootClassName = `relative w-full overflow-hidden ${containerClassName}`

  const imageNode = (
    <div className="relative h-full min-h-[inherit] w-full">
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse bg-motif-deep/[0.06]"
          aria-hidden
        />
      )}
      <Image
        src={photo.src}
        alt={photo.alt ?? 'Love story moment'}
        fill
        sizes={sizes}
        className={`${imageClassName} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        quality={85}
        priority={priority}
        onLoadingComplete={() => onImageLoaded?.(photo.src)}
      />
    </div>
  )

  if (onPhotoClick) {
    return (
      <button
        type="button"
        onClick={() => onPhotoClick(photo, photoIndex)}
        className={`${rootClassName} block cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-motif-accent/60 focus-visible:ring-offset-2 ${focusRingOffsetClass}`}
        aria-label={photo.alt ?? clickLabel}
      >
        {imageNode}
      </button>
    )
  }

  return <div className={rootClassName}>{imageNode}</div>
}

function SpreadHalf({
  photo,
  side,
  priority,
  sizes,
  imageClassName,
  onPhotoClick,
  photoIndex,
  clickLabel,
  focusRingOffsetClass,
  isLoaded,
  onImageLoaded,
}: {
  photo?: FlipbookPhoto
  side: 'left' | 'right'
  priority?: boolean
  sizes: string
  imageClassName: string
  onPhotoClick?: (photo: FlipbookPhoto, index: number) => void
  photoIndex: number
  clickLabel: string
  focusRingOffsetClass: string
  isLoaded: boolean
  onImageLoaded?: (src: string) => void
}) {
  const halfClass =
    side === 'left' ? 'album-flipbook-half-left border-r border-motif-silver/20' : 'album-flipbook-half-right'

  const content = photo ? (
    <div className="relative h-full w-full min-h-[inherit]">
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse bg-motif-deep/[0.06]"
          aria-hidden
        />
      )}
      <Image
        src={photo.src}
        alt={photo.alt ?? 'Love story moment'}
        fill
        sizes={sizes}
        className={`${imageClassName} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        quality={85}
        priority={priority}
        onLoadingComplete={() => onImageLoaded?.(photo.src)}
      />
    </div>
  ) : (
    <div className="album-flipbook-blank-page" aria-hidden />
  )

  if (photo && onPhotoClick) {
    return (
      <button
        type="button"
        onClick={() => onPhotoClick(photo, photoIndex)}
        className={`album-flipbook-half relative min-h-[inherit] flex-1 cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-motif-accent/60 focus-visible:ring-offset-2 ${halfClass} ${focusRingOffsetClass}`}
        aria-label={photo.alt ?? clickLabel}
      >
        {content}
      </button>
    )
  }

  return <div className={`album-flipbook-half relative min-h-[inherit] flex-1 ${halfClass}`}>{content}</div>
}

function SpreadPhotoPage({
  spread,
  spreadStartIndex,
  priority,
  sizes,
  spreadImageClassName,
  containerClassName,
  onPhotoClick,
  clickLabel,
  focusRingOffsetClass,
  loadedImages,
  onImageLoaded,
}: {
  spread: FlipbookPhoto[]
  spreadStartIndex: number
  priority?: boolean
  sizes: string
  imageClassName: string
  spreadImageClassName: string
  containerClassName: string
  onPhotoClick?: (photo: FlipbookPhoto, index: number) => void
  clickLabel: string
  focusRingOffsetClass: string
  loadedImages: Set<string>
  onImageLoaded?: (src: string) => void
}) {
  const left = spread[0]
  const right = spread[1]

  return (
    <div className={`relative flex w-full flex-row overflow-hidden ${containerClassName}`}>
      <div className="album-flipbook-spine hidden sm:block" aria-hidden />
      <SpreadHalf
        photo={left}
        side="left"
        priority={priority}
        sizes={sizes}
        imageClassName={spreadImageClassName}
        onPhotoClick={onPhotoClick}
        photoIndex={spreadStartIndex}
        clickLabel={clickLabel}
        focusRingOffsetClass={focusRingOffsetClass}
        isLoaded={!left?.src || loadedImages.has(left.src)}
        onImageLoaded={onImageLoaded}
      />
      <SpreadHalf
        photo={right}
        side="right"
        sizes={sizes}
        imageClassName={spreadImageClassName}
        onPhotoClick={onPhotoClick}
        photoIndex={spreadStartIndex + 1}
        clickLabel={clickLabel}
        focusRingOffsetClass={focusRingOffsetClass}
        isLoaded={!right?.src || loadedImages.has(right.src)}
        onImageLoaded={onImageLoaded}
      />
    </div>
  )
}

function spreadPhotoIndex(slides: FlipbookSlide[], slideIndex: number) {
  let index = 0
  for (let i = 0; i < slideIndex; i += 1) {
    index += slidePhotos(slides[i]).length
  }
  return index
}

function FlipbookPage({
  slide,
  slideIndex,
  slides,
  priority,
  sizes,
  imageClassName,
  spreadImageClassName,
  containerClassName,
  spreadContainerClassName,
  onPhotoClick,
  clickLabel,
  focusRingOffsetClass,
  loadedImages,
  onImageLoaded,
}: {
  slide: FlipbookSlide
  slideIndex: number
  slides: FlipbookSlide[]
  priority?: boolean
  sizes: string
  imageClassName: string
  spreadImageClassName: string
  containerClassName: string
  spreadContainerClassName: string
  onPhotoClick?: (photo: FlipbookPhoto, index: number) => void
  clickLabel: string
  focusRingOffsetClass: string
  loadedImages: Set<string>
  onImageLoaded?: (src: string) => void
}) {
  if (isSpreadSlide(slide)) {
    return (
      <SpreadPhotoPage
        spread={slide}
        spreadStartIndex={spreadPhotoIndex(slides, slideIndex)}
        priority={priority}
        sizes={sizes}
        imageClassName={imageClassName}
        spreadImageClassName={spreadImageClassName}
        containerClassName={spreadContainerClassName}
        onPhotoClick={onPhotoClick}
        clickLabel={clickLabel}
        focusRingOffsetClass={focusRingOffsetClass}
        loadedImages={loadedImages}
        onImageLoaded={onImageLoaded}
      />
    )
  }

  return (
    <SinglePhotoPage
      photo={slide}
      priority={priority}
      sizes={sizes}
      imageClassName={imageClassName}
      containerClassName={containerClassName}
      onPhotoClick={onPhotoClick}
      photoIndex={spreadPhotoIndex(slides, slideIndex)}
      clickLabel={clickLabel}
      focusRingOffsetClass={focusRingOffsetClass}
      isLoaded={!slide.src || loadedImages.has(slide.src)}
      onImageLoaded={onImageLoaded}
    />
  )
}

interface PhotoFlipbookProps {
  photos: FlipbookPhoto[]
  className?: string
  /** Standalone album block vs embedded inside StorySection */
  variant?: 'album' | 'story'
  /** One photo per page, paired portrait spreads, or auto by orientation */
  pageLayout?: FlipbookPageLayout
  isDark?: boolean
  rotation?: string
  imageSizes?: string
  spreadImageSizes?: string
  imageClassName?: string
  spreadImageClassName?: string
  containerClassName?: string
  spreadContainerClassName?: string
  onPhotoClick?: (photo: FlipbookPhoto, index: number) => void
  clickLabel?: string
  focusRingOffsetClass?: string
  /** Pre-measured dimensions from parent — avoids duplicate probing and layout jumps */
  knownPhotoSizes?: Map<string, PhotoSize>
}

export function PhotoFlipbook({
  photos,
  className = '',
  variant = 'album',
  pageLayout = 'single',
  isDark = false,
  rotation = '',
  imageSizes = '(max-width: 767px) 100vw, 38vw',
  spreadImageSizes = '(max-width: 767px) 50vw, 20vw',
  imageClassName = 'object-contain object-center',
  spreadImageClassName = 'object-cover object-center',
  containerClassName = 'min-h-[12rem] sm:min-h-[16rem] md:min-h-[18rem]',
  spreadContainerClassName = 'min-h-[14rem] sm:min-h-[18rem] md:min-h-[22rem] lg:min-h-[26rem]',
  onPhotoClick,
  clickLabel = 'Enlarge story photo',
  focusRingOffsetClass = 'focus-visible:ring-offset-motif-cream',
  knownPhotoSizes,
}: PhotoFlipbookProps) {
  const [internalPhotoSizes, setInternalPhotoSizes] = useState<Map<string, PhotoSize>>(new Map())
  const photoSizes = knownPhotoSizes ?? internalPhotoSizes

  useEffect(() => {
    if (knownPhotoSizes || pageLayout !== 'adaptive' || photos.length === 0) return

    photos.forEach((photo) => {
      if (!photo.src || photoSizes.has(photo.src)) return
      const probe = new window.Image()
      probe.onload = () => {
        setInternalPhotoSizes((prev) => {
          if (prev.has(photo.src)) return prev
          const next = new Map(prev)
          next.set(photo.src, { w: probe.naturalWidth, h: probe.naturalHeight })
          return next
        })
      }
      probe.onerror = () => {
        setInternalPhotoSizes((prev) => {
          if (prev.has(photo.src)) return prev
          const next = new Map(prev)
          next.set(photo.src, { w: 3, h: 4 })
          return next
        })
      }
      probe.src = photo.src
    })
  }, [knownPhotoSizes, pageLayout, photos])

  const allPhotoUrls = useMemo(
    () => photos.map((photo) => photo.src).filter(Boolean),
    [photos],
  )
  const { loaded: loadedImages, markLoaded: markImageLoaded } = useLoadedImages(allPhotoUrls)

  const slides = useMemo<FlipbookSlide[]>(() => {
    if (photos.length === 0) return []
    if (pageLayout === 'spread') return finalizeSlides(chunkIntoSpreads(photos))
    if (pageLayout === 'adaptive') {
      const allProbed = photos.every((photo) => photoSizes.has(photo.src))
      if (!allProbed) return finalizeSlides(photos)
      return finalizeSlides(buildAdaptiveSlides(photos, photoSizes))
    }
    return finalizeSlides(photos)
  }, [pageLayout, photos, photoSizes])

  const slidesKey = useMemo(
    () =>
      slides
        .map((slide) =>
          isSpreadSlide(slide) ? slide.map((photo) => photo.src).join('+') : slide.src,
        )
        .join('|'),
    [slides],
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setCurrentIndex(0)
    setIsFlipping(false)
    if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [slidesKey])

  useEffect(() => {
    setCurrentIndex((prev) => (prev >= slides.length ? 0 : prev))
  }, [slides.length])

  const nextIndex =
    slides.length > 0 ? findNextSlideIndex(slides, currentIndex) : 0
  const hasMultipleSlides = slides.length > 1
  const currentSlide = slides[currentIndex] ?? slides[0]
  const incomingSlide = slides[nextIndex] ?? slides[0]
  const currentIsSpread = currentSlide ? isSpreadSlide(currentSlide) : false
  const incomingReady = currentSlide ? slideIsReady(incomingSlide, loadedImages) : false

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onVisibility = () => setIsPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const completeFlip = useCallback(() => {
    setCurrentIndex((prev) => findNextSlideIndex(slides, prev))
    setIsFlipping(false)
  }, [slides])

  const startFlip = useCallback(() => {
    if (!hasMultipleSlides || isFlipping || !incomingReady) return
    setIsFlipping(true)
    if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current)
    flipTimeoutRef.current = setTimeout(completeFlip, TRANSITION_MS)
  }, [completeFlip, hasMultipleSlides, incomingReady, isFlipping])

  useEffect(() => {
    if (!hasMultipleSlides || !isVisible || isPaused || isFlipping) return

    intervalRef.current = setInterval(startFlip, INTERVAL_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [hasMultipleSlides, isVisible, isPaused, isFlipping, incomingReady, startFlip])

  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const incomingIsSpread = isSpreadSlide(incomingSlide)
  const isStoryFlipbook = variant === 'story'
  const isLandscapeMode =
    isStoryFlipbook && slides.length > 0 && slides.every((slide) => !isSpreadSlide(slide))

  const imageFrameClass = isDark
    ? 'bg-motif-cream p-1.5 md:p-3 shadow-lg'
    : 'bg-motif-cream p-1.5 md:p-3 shadow-md'

  const imageBg = isDark ? 'bg-black/15' : 'bg-motif-deep/[0.04]'

  const albumShell =
    variant === 'album'
      ? 'album-flipbook relative rounded-sm bg-motif-cream/80 p-3 sm:p-4 md:p-5 shadow-[0_8px_40px_-12px_rgba(15,28,63,0.2)] border border-motif-silver/40'
      : isStoryFlipbook
        ? `album-flipbook album-flipbook-story-shell relative rounded-sm bg-motif-cream w-full max-w-full overflow-hidden border border-motif-silver/35 shadow-xl p-2 sm:p-2.5 md:p-3 ${rotation} ${
            currentIsSpread ? 'album-flipbook-spread-shell' : ''
          } ${isLandscapeMode ? 'album-flipbook-landscape-shell' : ''}`
        : `${imageFrameClass} w-full max-w-full overflow-hidden rounded-sm ${rotation}`

  const stageMinHeight =
    variant === 'album'
      ? { minHeight: 'clamp(14rem, 50vw, 28rem)' }
      : isStoryFlipbook
        ? isLandscapeMode
          ? { minHeight: 'clamp(12rem, 52vw, 34rem)' }
          : { minHeight: 'clamp(14rem, 44vw, 28rem)' }
        : undefined

  const showBookChrome = variant === 'album' || (isStoryFlipbook && (currentIsSpread || incomingIsSpread))

  if (photos.length === 0) {
    return (
      <div className={`relative w-full ${className}`} aria-hidden>
        <div className={`${containerClassName} animate-pulse bg-motif-deep/[0.06] rounded-sm`} />
      </div>
    )
  }

  const flipbookInner = (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      aria-roledescription="photo album"
      aria-label={currentIsSpread ? 'Story photo album, open book spread' : 'Story photo album'}
      aria-live="off"
    >
      {showBookChrome && (
        <>
          <div
            className="pointer-events-none absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-20 opacity-30"
            style={{
              background:
                'linear-gradient(to bottom, transparent, var(--color-motif-silver), transparent)',
            }}
            aria-hidden
          />
          <div className="album-flipbook-binding" aria-hidden />
        </>
      )}

      <div className={albumShell} style={stageMinHeight}>
        <div className={`relative w-full h-full overflow-hidden ${variant === 'story' ? imageBg : ''}`}>
          <div className="album-flipbook-stage relative w-full h-full min-h-[inherit]">
            {hasMultipleSlides && incomingReady && (
              <div
                className={`absolute inset-0 min-h-[inherit] transition-opacity duration-200 ease-out ${
                  isFlipping ? 'opacity-100 z-0' : 'opacity-0 z-0 pointer-events-none'
                }`}
                aria-hidden={!isFlipping}
              >
                <FlipbookPage
                  slide={incomingSlide}
                  slideIndex={nextIndex}
                  slides={slides}
                  sizes={isSpreadSlide(incomingSlide) ? spreadImageSizes : imageSizes}
                  imageClassName={imageClassName}
                  spreadImageClassName={spreadImageClassName}
                  containerClassName={containerClassName}
                  spreadContainerClassName={spreadContainerClassName}
                  onPhotoClick={onPhotoClick}
                  clickLabel={clickLabel}
                  focusRingOffsetClass={focusRingOffsetClass}
                  loadedImages={loadedImages}
                  onImageLoaded={markImageLoaded}
                />
              </div>
            )}

            <div
              key={isFlipping ? `turning-${currentIndex}` : `resting-${currentIndex}`}
              className={`relative z-10 min-h-[inherit] album-flipbook-page ${
                isFlipping ? 'album-flipbook-page-turning' : ''
              }`}
            >
              <div className="album-flipbook-face album-flipbook-front min-h-[inherit]">
                <FlipbookPage
                  slide={currentSlide}
                  slideIndex={currentIndex}
                  slides={slides}
                  priority
                  sizes={currentIsSpread ? spreadImageSizes : imageSizes}
                  imageClassName={imageClassName}
                  spreadImageClassName={spreadImageClassName}
                  containerClassName={containerClassName}
                  spreadContainerClassName={spreadContainerClassName}
                  onPhotoClick={onPhotoClick}
                  clickLabel={clickLabel}
                  focusRingOffsetClass={focusRingOffsetClass}
                  loadedImages={loadedImages}
                  onImageLoaded={markImageLoaded}
                />
              </div>
              <div
                className="album-flipbook-face album-flipbook-back rounded-sm border border-motif-silver/30"
                aria-hidden
              >
                <div className="h-full w-full min-h-[inherit] bg-motif-cream flex items-center justify-center">
                  <div className="w-12 sm:w-16 h-px bg-motif-silver opacity-60" />
                </div>
              </div>
            </div>
          </div>

          {isDark && variant === 'story' && (
            <div className="pointer-events-none absolute inset-0 z-10 bg-black/5 mix-blend-multiply" />
          )}
        </div>
      </div>
    </div>
  )

  return flipbookInner
}
