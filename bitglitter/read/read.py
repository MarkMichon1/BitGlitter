import logging

from bitglitter.config.settingsmanager import settings_manager
from bitglitter.config.statisticsmanager import stats_manager
from bitglitter.read.decodehandler import DecodeHandler
from bitglitter.utilities.loggingset import logging_setter
from bitglitter.validation.validateread import verify_read_parameters


def read(file_path,
         output_path=False,
         bad_frame_strikes=25,
         max_cpu_cores=0,

         # Overrides
         block_height_override=False,
         block_width_override=False,
         stream_palette_id_override=False,

         # Crypto Input
         encryption_key=None,
         scrypt_n=14,
         scrypt_r=8,
         scrypt_p=1,

         # Logging Settings
         logging_level='info',
         logging_screen_output=True,
         logging_save_output=False,

         # Session Data
         save_statistics=False
         ):

    """This is the high level function that decodes BitGlitter encoded images and video back into the files/folders
    contained within them.  This along with write() are the two primary functions of this library.
    """

    # Logging initializing.
    logging_setter(logging_level, logging_screen_output, logging_save_output, settings_manager.log_txt_path)
    logging.info('Beginning read...')

    # Are all parameters acceptable?
    input_type = verify_read_parameters(file_path, output_path, encryption_key, scrypt_n, scrypt_r, scrypt_p,
                           block_height_override, block_width_override, max_cpu_cores, stream_palette_id_override,
                           save_statistics)

    # This sets the name of the temporary folder while screened data from partial saves is being written.
    partial_save_path = settings_manager.DEFAULT_PARTIAL_SAVE_DATA_PATH


    # Pull valid frame data from the inputted file.
    decode_handler = DecodeHandler(file_path, output_path, input_type, bad_frame_strikes, max_cpu_cores,
                                   block_height_override, block_width_override, stream_palette_id_override,
                                   encryption_key, scrypt_n, scrypt_r, scrypt_p, save_statistics, partial_save_path)

    # Review decoded data to check if any files can be extracted.
    decode_handler.review_data()

    if save_statistics:
        stats_manager.read_update(decode_handler.blocks_read, decode_handler.unique_frames_read,
                                   decode_handler.data_read)
