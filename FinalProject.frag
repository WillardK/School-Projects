#version 330 compatibility

uniform float uImageUnit;
uniform bool uTransferFunctionOn;
uniform float uTerrainHeight;
uniform float uKa, uKd, uKs;
uniform float uShininess;
uniform vec4 uSpecularColor;
uniform vec4 uColor;
uniform float uAmp;
uniform bool uWaveOn;

in vec3 vNs;
in vec3 vLs;
in vec3 vEs;
in vec3 vMC;
in float Z;

out vec4 fFragColor;

void
main()
{	
	vec3 Normal = normalize(vNs);							// Standard Lighting Model Here
	vec3 Light = normalize(vLs);
	vec3 Eye = normalize(vEs);
	vec4 Color;
		
	if(uTransferFunctionOn) {							// Apply Transfer Function, if desired
	
		vec4 DarkBlue = vec4(0., 0., .5, 1.);
		vec4 Blue = vec4(0., 0., 1., 1.);
		vec4 Green = vec4(0., 1., 0., 1.);
		vec4 Red = vec4(1., 0., 0., 1.);
	
		float range = uTerrainHeight;				// turn height range of Z into color range
		if(uWaveOn)
			range += uAmp;
		float a = Z / range;						//		between 0 and 1.
		
		if(!uWaveOn)
			a = abs(a);
		
		if (a < 0. || a == 0.) {
		
			Color = DarkBlue;
		}
		else if (a > 0. && a < .33) {									// simple switch case statement for color mapping
			
			a = a * 3.;
			Color = mix(DarkBlue, Blue, a); 
		}
		else if (a > .33 && a < .66) {
		
			a = (a - .33) * 3.;
			Color = mix(Blue, Green, a);
		}
		else if (a > .66 && a < 1.){
		
			a = (a - .66) * 3.;
			Color = mix(Green, Red, a);
		}
		
		
	
	}
	else {												// Otherwise pass on program color
	
		Color = uColor;
	}
	
	vec4 ambient = uKa * Color;

	float d = max( dot(Normal,Light), 0. );
	vec4 diffuse = uKd * d * Color;
	
	float s = 0.;
	if( dot(Normal,Light) > 0. ) // only do specular if the light can see the point
	{
		vec3 ref = normalize( 2. * Normal * dot(Normal,Light) - Light );
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec4 specular = uKs * s * uSpecularColor;
	
	fFragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, 1. );
}