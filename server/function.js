/* 
 * Author: Zhu Qichen
 * 
 * Copyright (C) 2014 Institute of Software, CAS <info@iscas.ac.cn>
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

function debugLog(log) {
	if (debugFlag) {
		process.stdout.write(new Date().toString() + ' ');
		console.log(log);
	}
}

function md5(str) {
	return crypto.createHash('md5').update(str).digest('hex');
};

var hash = md5;

var randomId = (function() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return function() {
		return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
	};
})();

function createFile(path, callback) {
	fs.open(path, 'wx', 0644, function(err, fd){
		if (err) {
			callback(err);
		} else {
			fs.close(fd, callback);
		}
	});
}

function parseName(name) {
	if (typeof(name) === 'string' && name.length === 32 && name.match(/^[0-9a-f]+$/)) {
		return name;
	} else {
		throw 'NameError';
	}
}

function getUserPath(uid) {
	return devfsPath + '/' + uid;
}

function getDataPath(uid, vertex) {
	return getUserPath(uid) + '/' + vertex;
}

function getPropertyPath(uid, property) {
	return getUserPath(uid) + '/' + property;
}

function getVertexPropertyPath(uid, property, vertex) {
	return getPropertyPath(uid, property) + '/' + vertex;
}

function getVertexPropertySubVertexPath(uid, property, vertex, subVertex) {
	return getVertexPropertyPath(uid, property, vertex) + '/' + subVertex;
}

function getPath(uid, property, vertex, subVertex) {
	if (property) {
		if (vertex) {
			if (subVertex) {
				return getVertexPropertySubVertexPath(uid, property, vertex, subVertex);
			} else {
				return getVertexPropertyPath(uid, property, vertex);
			}
		} else {
			return getPropertyPath(uid, property);
		}
	} else {
		if (vertex) {
			return getDataPath(uid, vertex);
		} else {
			return getUserPath(uid);
		}
	}
}

function getEdgePath(uid, vertex, subVertex) {
	return getPath(uid, 'edge', vertex, subVertex);
}

function getVertexPath(uid, vertex, subVertex) {
	return getPath(uid, 'vertex', vertex, subVertex);
}

function getAttrPath(uid, vertex, attr) {
	return getPath(uid, 'attr', vertex, attr);
}