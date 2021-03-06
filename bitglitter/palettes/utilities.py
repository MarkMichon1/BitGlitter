import hashlib
import itertools
import logging
import math

from bitstring import BitArray, ConstBitStream


class ValuesToColor:
    """This generates a dictionary linking a string binary value to an RGB value.  This is how binary data gets directly
    converted to colors.  This step required more than a dictionary, as additional logic was required to switch between
    a standard dictionary used by default and custom palettes, and 24 bit palettes.  They both convert data to colors in
    different ways, and this provides a single clean interface for that.
    """

    def __init__(self, palette, palette_type):

        logging.debug(f'Generating binary : color dictionary for {palette_type}...')
        self.palette = palette
        self.bit_length = self.palette.bit_length
        self.return_value = self.generate_dictionary()

    def generate_dictionary(self):

        def twenty_four_bit_values(bit_value):

            red_channel = bit_value.read('uint : 8')
            green_channel = bit_value.read('uint : 8')
            blue_channel = bit_value.read('uint : 8')
            return (red_channel, green_channel, blue_channel)

        color_dict = {}
        if self.palette.bit_length != 24:

            for value in range(len(self.palette.color_set)):
                temp_bin_holder = str(BitArray(uint=value, length=self.palette.bit_length))
                temp_bin_holder = ConstBitStream(temp_bin_holder)
                color_dict[temp_bin_holder] = self.palette.color_set[value]
            return color_dict

        else:
            return twenty_four_bit_values

    def get_color(self, value):

        if self.bit_length != 24:
            return self.return_value[value]
        else:
            return self.return_value(value)


class ColorsToValue:
    """This class does the exact opposite as ValuesToColor.  This first generates a dictionary linking colors to
    specific bit values, and then get_value() accomplishes that.  It is worth noting that 24 bit color functions
    differently than the other color palettes, in that it doesn't use a dictionary, but rather converts each byte into
    an unsigned integer for each of it's three color channels, and then returns that color.
    """

    def __init__(self, palette):

        self.palette = palette
        self.return_value = self.generate_dictionary()

    def generate_dictionary(self):

        def twenty_four_bit_values(color):

            outgoing_data = BitArray()
            for color_channel in color:
                outgoing_data.append(BitArray(uint=color_channel, length=8))

            return outgoing_data

        value_dict = {}

        if self.palette.bit_length != 24:
            for value in range(len(self.palette.color_set)):
                temp_bin_holder = str(BitArray(uint=value, length=self.palette.bit_length))
                temp_bin_holder = ConstBitStream(temp_bin_holder)
                value_dict[self.palette[value]] = temp_bin_holder
            return value_dict
        else:
            return twenty_four_bit_values

    def get_value(self, color):
        if self.palette.bit_length != 24:
            return self.return_value[color]
        else:
            return self.return_value(color)


def get_color_distance(palette):
    """This function takes in the set of tuples in a palette, and calculates their proximity to each other in RGB space.
    Higher number denote 'safer' palettes to use in the field, as they are less prone to errors in the field.  Getting 0
    returned means you have at least a single pair of identical RGB values.  All values must be unique!
    """

    min_distance = None

    for pair in itertools.combinations(palette, 2):
        first_color, second_color = pair

        r_distance = (second_color[0] - first_color[0]) ** 2
        g_distance = (second_color[1] - first_color[1]) ** 2
        b_distance = (second_color[2] - first_color[2]) ** 2

        sum_of_distances = math.sqrt(r_distance + g_distance + b_distance)

        if min_distance is not None:
            if sum_of_distances < min_distance:
                min_distance = sum_of_distances
        else:
            min_distance = sum_of_distances

    return round(min_distance, 2)


def get_palette_id_from_hash(name, description, date_created, color_set):
    """Taking in the various parameters, this creates a unique ID for the object."""

    color_set_string = str(color_set)
    hasher = hashlib.sha256(str(name + description + date_created + color_set_string).encode())
    return hasher.hexdigest()
