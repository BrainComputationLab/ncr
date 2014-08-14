from setuptools import setup, find_packages

setup(
    name='ncr',
    version='0.01a',
    url='http://github.com/braincomputationlab/ncr',
    license='MIT',
    author='Nathan Jordan',
    author_email='nathan.m.jordan@gmail.com',
    description=(
        "Neo-Cortical Repository is a database system that allows "
        "neuroscientists to store, version, and share models amongst team "
        "members, or the neuroscience community."
    ),
    long_description=(
        open('README.md').read() +
        '\n\n' +
        open('CHANGELOG.md').read()
    ),
    packages=find_packages(exclude=['tests']),
    install_requires=[
        'flask',
        'flask-restful',
        'jsonschema',
    ],
    classifiers=[
        'Intended Audience :: Science/Research',
        'Intended Audience :: Education',
        'License :: OSI Approved :: MIT License',
        'Operating System :: POSIX',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.2',
        'Programming Language :: Python :: 3.3',
    ],
)
