#!/usr/bin/python
import sys, os
import cairosvg
name = str(sys.argv[1])
base = os.path.basename(name)
name_out = os.path.splitext(base)[0] + '.png'
extension = os.path.splitext(base)[1]
if (extension == '.svg'):
	cairosvg.svg2png(url=name, write_to=name_out)
