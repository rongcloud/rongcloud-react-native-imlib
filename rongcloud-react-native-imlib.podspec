require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']
  s.authors      = { 'rongcloud' => 'support@rongcloud.cn' }
  s.homepage     = package['homepage']
  s.platform     = :ios, "9.0"

  s.source       = { :git => package['repository']['url'] }
  s.source_files = 'lib/ios/**/*.{h,m}'
  s.requires_arc = true

  s.dependency "React"
  s.dependency 'RongCloudIM/IMLib', '~> 2.9.22'
end
