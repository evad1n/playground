import signal
from contextlib import contextmanager

class TimeoutException(Exception): pass

@contextmanager
def time_limit(seconds):
	""" Sets a time limit on a function call. """
	def signal_handler(signum, frame):
		raise TimeoutException("Timed out!")
	signal.signal(signal.SIGALRM, signal_handler)
	# signal.alarm() only takes integer values for seconds
	# use sinal.setitimer() for float values (subsecond precision)
	signal.setitimer(signal.ITIMER_REAL, seconds)
	try:
		yield
	finally:
		signal.alarm(0)
