//===========================================================
//
// osc

OscOut oscOut;
oscOut.dest("127.0.0.1", 12002);

// jeffs computer
//oscOut.dest("10.40.16.0", 7000);

fun void oscMsg(string addr, float byte)
{
	oscOut.start(addr);
	oscOut.add(byte);
	oscOut.send();
}

//===========================================================
//
// our patch
adc => LPF lp => FFT fft =^ RMS rms => blackhole;
adc => Gain g => dac;

400 => lp.freq;

512 => int buf_size;

44100/(buf_size*2) => int num_rms_values;
float rms_values[num_rms_values];
0 => int rms_counter;
0 => int onset_counter;
999 => int onset_timer;

// set parameters
buf_size => fft.size;
// set hann window
Windowing.hann(buf_size) => fft.window;

// interp value
float val;
float valLerp;
fun void interpval() {
	
	while(true) {
		(0.0 - valLerp)*0.3 +=> valLerp;
	
	  oscMsg("/composition/speed", 0.1+valLerp);
		
		50::ms => now;
	}
	
}
spork ~ interpval();

// control loop
while( true )
{
	// upchuck: take fft then rms
	rms.upchuck() @=> UAnaBlob rms_value;
	// store RMS value
	//<<<rms_value.fval(0)>>>;
	rms_value.fval(0) => rms_values[rms_counter];
	1 +=> rms_counter;
	rms_counter%num_rms_values => rms_counter;
	
	// calc average rms
	0 => float sum;
	for(int i;i<rms_values.size();i++) {
		rms_values[i] +=> sum;
	}
	sum/rms_values.size() => float av_rms;
	//<<<av_rms>>>;
	
	
	// calculate the variance of the rms values
	0.0 => float var_rms;
	for (int i; i < rms_values.size(); i++) {
		 var_rms + Math.fabs(rms_values[i] - av_rms) => var_rms;
	}
	var_rms / rms_values.size() => var_rms;
	//<<<var_rms>>>;
	
	// now we see if the current value is outside the mean + variance
	// basic statistics tells us a normally distributed function
	// has a mean and a variance where 97% of the data is explained by
	// 3 standard deviations.  we use this principle here in detecting 
	// the the current rms reading is outside this probability
	0.0005 => float min_rms;
	if (rms_value.fval(0) > (av_rms + 2.0 * var_rms) &&
	rms_value.fval(0) > min_rms && onset_timer > 25) {
		<<<"onset", onset_counter>>>;
		1 +=> onset_counter;
		
		oscMsg("/onset", 1);
		
		// jeffs computer
		//onset_counter%2.0 => float val;
		//oscMsg("/composition/video/effects/distortion/effect/distort", val*0.5);
		//oscMsg("/composition/speed", 0.2+val*0.5);
		//0.5 => valLerp;
		
		0 => onset_timer;
	}
	1 +=> onset_timer;
	
		
	// advance time
	fft.size()::samp => now;
}