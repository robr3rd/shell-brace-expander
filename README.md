# ShellBraceExpander

A Javascript-based implementation of [Shell Brace Expansions](https://www.gnu.org/software/bash/manual/html_node/Brace-Expansion.html#Brace-Expansion) because I couldn't find anything extant.

This takes something like `/path/to/{foo,bar{a,b}}` and turns it into:

- `/path/to/foo`
- `/path/to/bar/a`
- `/path/to/bar/b`


## Usage
```javascript
var Output = new ShellBraceExpander(input_to_expanded);
var expanded = Output.getExpansion();
```


## Examples

### Simple

#### No expansion
##### Input
`/path/to/file`
##### Output
- `/path/to/file`

#### Improper expansion (most shells will error)
##### Input
`/path/to/{file1}`
##### Output
- `/path/to/file1`

#### Simple expansion
##### Input
`/path/to/{file1,file2}`
##### Output
- `/path/to/file1`
- `/path/to/file2`

#### Simple expansion with subfolders
##### Input
`/path/to/{dir1/file1,dir2/dir3/file2}`
##### Output
- `/path/to/dir1/file1`
- `/path/to/dir2/dir3/file2`

#### Simple expansion with suffix
##### Input
`/path/to/{dir1,dir2}/file1`
##### Output
- `/path/to/dir1/file1`
- `/path/to/dir2/file1`

#### Simple expansion with blank and suffix
##### Input
`/path/to/{dir1,}/file1`
##### Output
- `/path/to/dir1/file1`
- `/path/to/file1`

#### Triple expansion
##### Input
`/path/to/{file1,file2,dir1/file3}`
##### Output
- `/path/to/file1`
- `/path/to/file2`
- `/path/to/dir1/file3`

#### Triple expansion * quadruple expansion (with content between)
##### Input
`/path/to/{file1,file2,file3}.{ext1,ext2,ext3,ext4}`
##### Output
- `/path/to/file1.ext1`
- `/path/to/file1.ext2`
- `/path/to/file1.ext3`
- `/path/to/file1.ext4`
- `/path/to/file2.ext1`
- `/path/to/file2.ext2`
- `/path/to/file2.ext3`
- `/path/to/file2.ext4`
- `/path/to/file3.ext1`
- `/path/to/file3.ext2`
- `/path/to/file3.ext3`
- `/path/to/file3.ext4`

#### Simple expansion with nested triple expansion
##### Input
`/path/to/{dir1,dir2/{file1,file2,file3}.txt}`
##### Output
- `/path/to/dir1`
- `/path/to/dir2/file1.txt`
- `/path/to/dir2/file2.txt`
- `/path/to/dir2/file3.txt`


### Advanced

#### Some fun
##### Input
`/path/to/{dir1/{dir2,dir3/file1.{ext1,ext2},file2,file3,file4},{dir4,dir5,dir6/{,dir7}}/file5}`

##### Human-readable Input
```
/path/to/{
	dir1/{
		dir2,
		dir3/file1.{
			ext1,
			ext2
		},
		file2,
		file3,
		file4
	},
	{
		dir4,
		dir5,
		dir6/{
			dir7,
		}
	}/file5
}
```

##### Output
- `/path/to/dir1/dir2`
- `/path/to/dir1/dir3/file1.ext1`
- `/path/to/dir1/dir3/file1.ext2`
- `/path/to/dir1/file2`
- `/path/to/dir1/file3`
- `/path/to/dir1/file4`
- `/path/to/dir4/file5`
- `/path/to/dir5/file5`
- `/path/to/dir6/file5`
- `/path/to/dir6/dir7/file5`


#### Excerpt from the script for which this was created
##### Filesystem
```
/var/www/project
|-- app
|   |-- code/local
|       |-- MyNamespace
|           |-- Module123
|       |-- DifferentNamespace
|           |-- Module123
|-- design/frontend/mytheme/default
|   |-- template/feature
|   |-- layout/feature.xml
|-- skin/frontend/mytheme
    |-- feature.css
    |-- js/feature.js
```

##### Input
`/var/www/magento/{app/{code/local/{MyNamespace,DifferentNamespace}/Module123,design/frontend/mytheme/default/{template/feature,layout/feature.xml}},skin/frontend/mytheme/{feature.css,js/feature.js}}`

##### Human-Readable

```
/var/www/magento/{
	app/{
		code/local/{
			MyNamespace,
			DifferentNamespace
		}/Module123,
		design/frontend/mytheme/default/{
			template/feature,
			layout/feature.xml
		}
	},
	skin/frontend/mytheme/{
		feature.css,
		js/feature.js
	}
}
```

##### Output
- `/var/www/magento/app/code/local/MyNamespace/Module123`
- `/var/www/magento/app/code/local/DifferentNamespace/Module123`
- `/var/www/magento/app/design/frontend/mytheme/default/template/feature`
- `/var/www/magento/app/design/frontend/mytheme/default/layout/feature.xml`
- `/var/www/magento/skin/frontend/mytheme/feature.css`
- `/var/www/magento/skin/frontend/mytheme/js/feature.js`
