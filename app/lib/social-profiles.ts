export const socialProfiles = {
  github: {
    label: "GitHub",
    url: "https://github.com/syunnjack",
  },
  youtube: {
    label: "YouTube（知多丸）",
    url: "https://www.youtube.com/@chitamaru3",
  },
  x: {
    label: "X（@chitamarudev）",
    url: "https://x.com/chitamarudev",
  },
} as const

export const socialProfileUrls = Object.values(socialProfiles).map(
  (profile) => profile.url,
)
