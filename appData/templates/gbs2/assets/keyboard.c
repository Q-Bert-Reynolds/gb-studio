// GB Studio keyboard layout: 18 cells per row, up to five rows.
// Each entry is one cell; each line below is an 18-cell row.
// Backspace(8), Return(13), Shift(14), Cancel(24), Space Bar left(188), middle(189), right(190).
// Cursor padding in pixels (0..8). Equal offsets disable the animation.
// Delay between offsets in frames (1..255); 60 frames is about one second.
const unsigned char osk_cursor_offset_min = 1;
const unsigned char osk_cursor_offset_max = 2;
const unsigned char osk_cursor_delay = 60;

const unsigned char osk_unshifted[] = {
    0, 0, '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=','\b', 0, 0,
    0, 0, 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']','\\',   0, 0, 0,
    0, 0, 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';','\'',   0,   0,   0, 0, 0,
    0, 0, 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',   0,   0,   0,'\r', 0, 0,
    0, 0,  14,   0, 188, 189, 189, 189, 190,   0,   0,   0,   0,   0,   0,   0, 0, 0,
};

const unsigned char osk_shifted[] = {
    0, 0, '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+','\b', 0, 0,
    0, 0, 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|',   0, 0, 0,
    0, 0, 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"',   0,   0,   0, 0, 0,
    0, 0, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?',   0,   0,   0,'\r', 0, 0,
    0, 0,  14,   0, 188, 189, 189, 189, 190,   0,   0,   0,   0,   0,   0,   0, 0, 0,
};