import os
import sys, getopt
import ntpath

def path_leaf(path):
    head, tail = ntpath.split(path)
    return tail or ntpath.basename(head)

def run_convert(path):
    cmd = "python3 convert.py " + path
    print(cmd)
    os.system(cmd)
    name = path_leaf(path)
    return name.split('.')[0]

def run_program(path, distance):
    cmd = "./out.out -f " + path + " -d " + distance
    print(cmd)
    os.system(cmd)

def remove(path):
    cmd = "rm " + path
    os.system(cmd)



path = str(sys.argv[1])
min_dis = str(sys.argv[2])
name = run_convert(path) + ".png"
run_program(name, min_dis)
remove(name)

        
