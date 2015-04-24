#!/usr/bin/env rake

# Only generate files by default
task :default => [:html, :css]

desc 'Generate all files and lint'
task :all  => [:html, :css, :lint]
desc 'Build css files'
task :css  => FileList['*.less'].ext('.css')
desc 'Build html files'
task :html => FileList['*.jade'].ext('.html')

desc 'Run a webserver'
task :web => [:html, :css] do
	require 'webrick'
	WEBrick::HTTPServer.new(
		:Port => 3000,
		:MaxClients => 5,
		:DocumentRoot => Dir.pwd).start
end


# === Definitions === #

task :lint do
	FileList['*.js', '*.json'].each do |src|
		sh "jshint #{src}"
	end
end

task :scrape do
	sh "casperjs scraper.js"
end

rule ".html" => ".jade" do |t| sh "jade --pretty #{t.source}"             	end
rule ".css"  => ".less" do |t| sh "lessc --no-color #{t.source} #{t.name}"	end

require 'rake/clean'
CLOBBER.include(FileList['*.html', '*.css'])
