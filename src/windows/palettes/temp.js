/*
todo:  this will probably be merged with another module
todo: disallow exporting default palettes with b64
Returned validation values:
Name
    taken: This palette name is already taken, please choose another
    none: Palette name is required
    exists:  This palette is already saved
    ascii: Palette name can only use standard ASCII characters (a-z, A-Z, 0-9, normal punctuation and symbols)
    max_length: Palette name cannot exceed 50 characters
Description
    max_length: Palette description cannot exceed 100 characters
Color Set
    max_length: Custom palettes cannot exceed 256 colors
    2^n: Number of colors must be a power of 2 (2, 4, 8, 16, etc), with a minimum of 2 colors
    channels: Each color needs 3 channels, for red green and blue
    range: For each RGB value, it must be an integer between 0 and 255
    distance: Cannot have two identical colors in a color set


B64 validation errors
    invalid: Corrupt or incomplete string
    invalid2: Nice try ;)
    exists:  This palette already exists locally
    name: Palette with this name already exists

 */