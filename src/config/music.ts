// ============================================================
//  MUSIC — your background tracks
//  Drop MP3s in /public/music/ and reference them below,
//  or use any direct audio URL.
//  You can also add/remove tracks live from the player UI.
// ============================================================

export type Track = {
  title: string;
  /** Local path like "/music/song.mp3" or any direct audio URL */
  src: string;
};

export const music = {
  /** Show or hide the music player */
  enabled: true,
  /** Try to autoplay on load (browser may still require a click) */
  autoplay: false,
  /** Default volume: 0 to 1 */
  volume: 0.5,
  tracks: [
    { title: "unterwegs :)", src: "/music/unterwegs%20).mp3" },
    { title: "Chill Beats",     src: "/music/track2.mp3" },
    { title: "Night Drive",     src: "/music/track3.mp3" },
  ] as Track[],
};
